import { CONTRACT_ADDRESS } from './contractAddr';
import contractABI from '@/src/abi/ForgeNFT.json';

export const FORGE_NFT_CONFIG = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: contractABI,
} as const;