import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import contractABI from '@/src/abi/ForgeNFT.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export async function POST(request: NextRequest) {
  try {
    const { tokenId } = await request.json();

    if (!tokenId) {
      return NextResponse.json({ error: 'Token ID required' }, { status: 400 });
    }

    // Create provider and contract
    const provider = new ethers.JsonRpcProvider("https://sepolia.gateway.tenderly.co");
    const contract = new ethers.Contract(CONTRACT_ADDRESS!, contractABI, provider);

    // Get owner
    const owner = await contract.ownerOf(tokenId);

    return NextResponse.json({ owner });
  } catch (error) {
    console.error('Error getting owner:', error);
    return NextResponse.json(
      { error: 'Failed to get owner' },
      { status: 500 }
    );
  }
}