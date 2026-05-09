import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import contractABI from '@/src/contracts/ForgeNFT.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export async function POST(request: NextRequest) {
  try {
    const { tokenId } = await request.json();

    if (!tokenId) {
      return NextResponse.json({ error: 'Token ID required' }, { status: 400 });
    }

    // Create provider and contract
    const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
    const contract = new ethers.Contract(CONTRACT_ADDRESS!, contractABI, provider);

    // Get tokenURI
    const tokenURI = await contract.tokenURI(tokenId);

    return NextResponse.json({ tokenURI });
  } catch (error) {
    console.error('Error getting tokenURI:', error);
    return NextResponse.json(
      { error: 'Failed to get tokenURI' },
      { status: 500 }
    );
  }
}