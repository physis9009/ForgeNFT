'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { FORGE_NFT_CONFIG } from '@/src/config/forgeNFT';

export function useBurnNFT() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const burnNFT = (tokenId: bigint) => {
    writeContract({
      ...FORGE_NFT_CONFIG,
      functionName: 'burn',
      args: [tokenId],
    });
  };

  return {
    burnNFT,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}