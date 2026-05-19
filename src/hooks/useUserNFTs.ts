'use client';

import { useReadContract, useReadContracts } from 'wagmi';
import { FORGE_NFT_CONFIG } from '@/src/config/forgeNFT';
import { useAccount } from 'wagmi';
import { fetchNFTMetadata, getIPFSImageURL, type NFTMetadata } from '@/src/lib/nftMetadata';
import { useState, useEffect, useMemo } from 'react';
import { type Abi } from 'viem';

export interface UserNFT {
  tokenId: bigint;
  metadata: NFTMetadata | null;
  imageUrl: string;
}

export function useUserNFTs() {
  const { address } = useAccount();

  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    ...FORGE_NFT_CONFIG,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const indices = useMemo(() => {
    if (!balance || balance === BigInt(0)) return [];
    return Array.from({ length: Number(balance) }, (_, i) => BigInt(i));
  }, [balance]);

  const { data: tokenIdsRaw, isLoading: isLoadingTokenIds } = useReadContracts({
    contracts: indices.map((index) => ({
      ...FORGE_NFT_CONFIG,
      abi: FORGE_NFT_CONFIG.abi as Abi,
      functionName: 'tokenOfOwnerByIndex',
      args: [address!, index],
    })),
    query: { enabled: !!address && indices.length > 0 },
  });

  const tokenIds: bigint[] = useMemo(() => {
    if (!tokenIdsRaw) return [];
    return tokenIdsRaw
      .filter((result) => result.status === 'success')
      .map((result) => result.result as bigint);
  }, [tokenIdsRaw]);

  const { data: urisRaw, isLoading: isLoadingUris } = useReadContracts({
    contracts: tokenIds.map((tokenId) => ({
      ...FORGE_NFT_CONFIG,
      abi: FORGE_NFT_CONFIG.abi as Abi, 
      functionName: 'tokenURI',
      args: [tokenId],
    })),
    query: { enabled: tokenIds.length > 0 },
  });

  const [userNFTs, setUserNFTs] = useState<UserNFT[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  useEffect(() => {
    if (!urisRaw || urisRaw.length === 0 || tokenIds.length === 0) {
      setUserNFTs([]);
      return;
    }

    let cancelled = false;
    setIsLoadingMetadata(true);

    (async () => {
      const nfts: UserNFT[] = [];
      for (let i = 0; i < tokenIds.length; i++) {
        if (cancelled) break;
        const result = urisRaw[i];
        if (result.status !== 'success') continue;

        try {
          const uri = result.result as string;
          const metadata = await fetchNFTMetadata(uri);
          const imageUrl = metadata ? getIPFSImageURL(metadata.image) : '';
          nfts.push({ tokenId: tokenIds[i], metadata, imageUrl });
        } catch (err) {
          console.error(`Failed to load metadata for token ${tokenIds[i]}`, err);
          nfts.push({ tokenId: tokenIds[i], metadata: null, imageUrl: '' });
        }
      }

      if (!cancelled) {
        setUserNFTs(nfts);
        setIsLoadingMetadata(false);
      }
    })();

    return () => {
      cancelled = true;
      setIsLoadingMetadata(false);
    };
  }, [urisRaw, tokenIds]);

  return {
    balance,
    userNFTs,
    isLoadingNFTs: isLoadingBalance || isLoadingTokenIds || isLoadingUris || isLoadingMetadata,
  };
}