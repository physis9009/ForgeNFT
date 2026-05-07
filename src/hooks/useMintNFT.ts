'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { FORGE_NFT_CONFIG } from '@/src//config/forgeNFT';

export function useMintNFT() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintNFT = (uri: string) => {
    writeContract({
      ...FORGE_NFT_CONFIG,
      functionName: 'mint',
      args: [uri],
    });
  };

  return {
    mintNFT,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}