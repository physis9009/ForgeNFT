'use client';

import { useReadContract } from 'wagmi';
import { FORGE_NFT_CONFIG } from '@/config/forgeNFT';
import { useAccount } from 'wagmi';

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

  return {
    balance,
    totalSupply,
    isLoadingBalance,
  };
}