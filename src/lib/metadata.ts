export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export function generateNFTMetadata(
  name: string,
  description: string,
  imageCID: string,
  attributes?: Array<{ trait_type: string; value: string }>
): NFTMetadata {
  return {
    name,
    description,
    image: `ipfs://${imageCID}`,
    attributes: attributes || [],
  };
}