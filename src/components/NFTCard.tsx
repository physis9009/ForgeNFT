import { UserNFT } from '@/src/hooks/useUserNFTs';
import { Silkscreen } from 'next/font/google';

const silkscreen = Silkscreen({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
});

interface NFTCardProps {
  nft: UserNFT;
  onBurn?: (tokenId: bigint) => void;
  isBurning?: boolean;
}

export function NFTCard({ nft, onBurn, isBurning = false }: NFTCardProps) {
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

      {onBurn && (
        <button
          onClick={() => onBurn(nft.tokenId)}
          disabled={isBurning}
          className={`${silkscreen.className} mt-3 bg-pnk-gr hover:bg-pnk text-blk px-3 py-1 rounded text-sm disabled:bg-wht-md disabled:text-grn-gr`}
        >
          {isBurning ? 'Burning...' : 'Burn'}
        </button>
      )}
    </div>
  );
}