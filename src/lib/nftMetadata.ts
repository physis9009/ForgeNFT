export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export async function fetchNFTMetadata(ipfsURI: string): Promise<NFTMetadata | null> {
  try {
    // Convert ipfs:// to https:// gateway URL
    const gatewayURL = ipfsURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');

    const response = await fetch(gatewayURL);
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }

    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    return null;
  }
}

export function getIPFSImageURL(imageURI: string): string {
  // Convert ipfs:// to https:// gateway URL
  return imageURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
}