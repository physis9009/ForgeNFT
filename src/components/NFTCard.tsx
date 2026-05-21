'use client'; 

import { useState } from 'react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBurnClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onBurn?.(nft.tokenId);
  };

  return (
    <>
      {/* 卡片 */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="border border-wht-gr rounded-lg p-4 shadow-inner shadow-wht-gr 
          hover:bg-wht hover:shadow-wht-gr hover:shadow-md transition-all duration-300 ease-out 
          break-inside-avoid cursor-pointer"
      >
        {/* 图片 */}
        <div className="mb-3 overflow-hidden rounded">
          {nft.imageUrl ? (
            <img
              src={nft.imageUrl}
              alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
              className="w-full h-auto block"
              loading="lazy"
            />
          ) : (
            <div className="w-full min-h-30 bg-wht-gr flex items-center justify-center text-blk-gr">
              No Image
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-sm truncate flex-1">
            {nft.metadata?.name || `NFT #${nft.tokenId}`}
          </h3>
          {onBurn && (
            <button
              onClick={handleBurnClick}
              disabled={isBurning}
              className={`${silkscreen.className} text-xs bg-pnk-gr/90 hover:bg-pnk text-blk px-2 py-0.5 rounded 
              disabled:opacity-50 disabled:cursor-not-allowed shrink-0 border-wht-md`}
              title="Burn this NFT"
            >
              {isBurning ? '...' : 'Burn'}
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-blk/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-3 -right-3 z-10 bg-wht-md rounded-full w-6 h-6 flex items-center justify-center 
                text-pnk hover:text-pnk-gr shadow-md text-lg leading-none"
            >
              ✕
            </button>

            <div className="flex-1 flex items-center justify-center overflow-hidden">
              {nft.imageUrl ? (
                <img
                  src={nft.imageUrl}
                  alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg"
                />
              ) : (
                <div className="w-75 h-50 bg-wht-gr flex items-center justify-center text-blk-gr rounded-lg">
                  No Image Available
                </div>
              )}
            </div>

            {nft.metadata?.description && (
              <div className="w-full mt-4 px-1">
                <p className="text-wht/90 text-sm text-center leading-relaxed">
                  {nft.metadata.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}