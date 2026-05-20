'use client';

import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { useUserNFTs } from '@/src/hooks/useUserNFTs';
import { useBurnNFT } from '@/src/hooks/useBurnNFT';
import { NFTCard } from '@/src/components/NFTCard';
import { Silkscreen } from 'next/font/google';

const silkscreen = Silkscreen({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
});

export default function GalleryPage() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { userNFTs, isLoadingNFTs } = useUserNFTs();
  const { burnNFT, isPending, isConfirming, isSuccess, error: burnError, hash } = useBurnNFT();

  const [burningTokenId, setBurningTokenId] = useState<bigint | null>(null);

  const isWrongNetwork = isConnected && chainId !== sepolia.id;

  const handleBurn = (tokenId: bigint) => {
    setBurningTokenId(tokenId);
    burnNFT(tokenId);
  };

  // 燃烧成功后清除状态
  if (isSuccess && burningTokenId !== null) {
    setBurningTokenId(null);
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className={`${silkscreen.className} text-2xl font-semibold mb-6 mt-16`}>
        {isConnected ? 'My NFTs' : 'Recent Mints'}
      </h2>

      {isWrongNetwork && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 mb-6 rounded">
          <p className={`${silkscreen.className} font-bold`}>Wrong Network</p>
          <p className={`${silkscreen.className} text-sm`}>Please switch to Sepolia testnet to view your NFTs</p>
          <button
            onClick={() => switchChain({ chainId: sepolia.id })}
            className={`${silkscreen.className} mt-2 bg-yellow-500 text-white px-4 py-1 rounded text-sm`}
          >
            Switch to Sepolia
          </button>
        </div>
      )}

      {isConnected ? (
        isLoadingNFTs ? (
          <p className={`${silkscreen.className} text-center text-gray-600`}>Loading your NFTs...</p>
        ) : userNFTs.length > 0 ? (
          <>
            <p className={`${silkscreen.className} mb-4 text-gray-600`}>
              You own {userNFTs.length} NFT{userNFTs.length !== 1 ? 's' : ''}
            </p>

            {/* 燃烧状态提示 */}
            {burnError && (
              <p className="mb-4 text-red-500">
                Burn failed: {burnError.message}
              </p>
            )}
            {isSuccess && hash && (
              <p className="mb-4 text-green-500">
                NFT burned successfully!{' '}
                <a
                  href={`https://sepolia.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  View transaction
                </a>
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userNFTs.map((nft) => (
                <NFTCard
                  key={nft.tokenId.toString()}
                  nft={nft}
                  onBurn={handleBurn}
                  isBurning={burningTokenId === nft.tokenId && (isPending || isConfirming)}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">
            You haven&apos;t minted any NFTs yet. Go to the mint page to create one!
          </p>
        )
      ) : (
        <p className="text-center text-gray-600">
          Connect your wallet to see your collection
        </p>
      )}
    </main>
  );
}