'use client';

import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { useUserNFTs } from '@/src/hooks/useUserNFTs';
import { useBurnNFT } from '@/src/hooks/useBurnNFT';
import { NFTCard } from '@/src/components/NFTCard';
import { Silkscreen } from 'next/font/google';
import { useTranslations } from 'next-intl';

const silkscreen = Silkscreen({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
});

export default function GalleryPage() {
  const t = useTranslations('GalleryPage');
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
        {isConnected ? t('titleConnected') : t('titleDisconnected')}
      </h2>

      {isWrongNetwork && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 mb-6 rounded">
          <p className={`${silkscreen.className} font-bold`}>{t('wrongNetwork.title')}</p>
          <p className={`${silkscreen.className} text-sm`}>{t('wrongNetwork.message')}</p>
          <button
            onClick={() => switchChain({ chainId: sepolia.id })}
            className={`${silkscreen.className} mt-2 bg-yellow-500 text-white px-4 py-1 rounded text-sm`}
          >
            {t('wrongNetwork.button')}
          </button>
        </div>
      )}

      {isConnected ? (
        isLoadingNFTs ? (
          <p className={`${silkscreen.className} text-center text-gray-600`}>{t('loading')}</p>
        ) : userNFTs.length > 0 ? (
          <>
            <p className={`${silkscreen.className} mb-4 text-gray-600`}>
              {userNFTs.length === 1 ? t('ownership', { count: userNFTs.length }) : t('ownershipPlural', { count: userNFTs.length })}
            </p>

            {/* 燃烧状态提示 */}
            {burnError && (
              <p className="mb-4 text-red-500">
                {t('burnFailed', { message: burnError.message })}
              </p>
            )}
            {isSuccess && hash && (
              <p className="mb-4 text-green-500">
                {t('burnSuccess')}{' '}
                <a
                  href={`https://sepolia.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {t('viewTransaction')}
                </a>
              </p>
            )}

            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
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
            {t('noNFTs')}
          </p>
        )
      ) : (
        <p className="text-center text-gray-600">
          {t('connectWallet')}
        </p>
      )}
    </main>
  );
}