import { UserNFT } from '@/src/hooks/useUserNFTs';

interface NFTCardProps {
  nft: UserNFT;
}

export function NFTCard({ nft }: NFTCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="aspect-square bg-gray-200 mb-4 overflow-hidden">
        {nft.imageUrl ? (
          <img
            src={nft.imageUrl}
            alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <h3 className="font-semibold">
        {nft.metadata?.name || `NFT #${nft.tokenId}`}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-2">
        {nft.metadata?.description || 'No description'}
      </p>
      <p className="text-xs text-gray-400 mt-2">Token ID: {nft.tokenId.toString()}</p>
    </div>
  );
}