import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();

    // Upload JSON to Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        pinataContent: json,
        pinataMetadata: {
          name: 'NFT Metadata',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
        },
      }
    );

    return NextResponse.json({ ipfsHash: response.data.IpfsHash });
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error);
    return NextResponse.json(
      { error: 'Failed to upload JSON to IPFS' },
      { status: 500 }
    );
  }
}