'use client';

import { useReadContract } from 'wagmi';
import { FORGE_NFT_CONFIG } from '@/src/config/forgeNFT';
import { useAccount } from 'wagmi';
import { fetchNFTMetadata, getIPFSImageURL, NFTMetadata } from '@/src/lib/nftMetadata';
import { useState, useEffect } from 'react';

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
    query: {
      enabled: !!address,
    },
  });

  const { data: totalSupply } = useReadContract({
    ...FORGE_NFT_CONFIG,
    functionName: 'totalSupply',
  });

  const [userNFTs, setUserNFTs] = useState<UserNFT[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);

  // Fetch user's NFTs when balance changes
  useEffect(() => {
    async function fetchUserNFTs() {
      if (!address || !balance || balance === BigInt(0)) {
        setUserNFTs([]);
        return;
      }

      setIsLoadingNFTs(true);
      const nfts: UserNFT[] = [];

      try {
        // Iterate through all tokens to find user's NFTs
        const total = (totalSupply as bigint) || BigInt(0);

        for (let i = BigInt(1); i <= total; i++) {
          try {
            // Check if this token belongs to the user using wagmi
            const ownerResponse = await fetch('/api/ownerOf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tokenId: i.toString() }),
            });

            if (ownerResponse.ok) {
              const ownerData = await ownerResponse.json();
              if (ownerData.owner?.toLowerCase() === address.toLowerCase()) {
                // Get tokenURI using wagmi
                const uriResponse = await fetch('/api/tokenURI', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ tokenId: i.toString() }),
                });

                if (uriResponse.ok) {
                  const uriData = await uriResponse.json();
                  const metadata = await fetchNFTMetadata(uriData.tokenURI);
                  const imageUrl = metadata ? getIPFSImageURL(metadata.image) : '';

                  nfts.push({
                    tokenId: i,
                    metadata,
                    imageUrl,
                  });
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching token ${i}:`, error);
          }
        }

        setUserNFTs(nfts);
      } catch (error) {
        console.error('Error fetching user NFTs:', error);
      } finally {
        setIsLoadingNFTs(false);
      }
    }

    fetchUserNFTs();
  }, [address, balance, totalSupply]);

  return {
    balance,
    totalSupply,
    userNFTs,
    isLoadingBalance,
    isLoadingNFTs,
  };
}