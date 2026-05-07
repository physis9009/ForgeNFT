import { CONTRACT_ADDRESS } from '@/src/config/contract';
import contractABI from '@/src/contracts/ForgeNFT.json';

export const FORGE_NFT_CONFIG = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: contractABI,
} as const;