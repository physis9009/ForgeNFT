'use client';

import { useEffect, useState, useRef } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { useMintNFT } from '@/src/hooks/useMintNFT';
import { uploadToPinata, uploadJSONToPinata } from '@/src/lib/ipfs';
import { generateNFTMetadata } from '@/src/lib/metadata';
import { Silkscreen } from 'next/font/google';
import {useTranslations} from 'next-intl';

const silkscreen = Silkscreen({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
});

export default function Page() {
  const t = useTranslations('Page');

  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { mintNFT, isPending, isConfirming, isSuccess, error, hash } = useMintNFT();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isWrongNetwork = isConnected && chainId !== sepolia.id;

  // 清理函数，防止内存泄露
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // mint成功后重置表单
  useEffect(() => {
    if (isSuccess) {
      setName('');
      setDescription('');
      setImage(null);
      setImagePreview('');
      setUploadError(null);
    }
  }, [isSuccess]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 从文件输入框获取用户选择的文件
    const file = e.target.files?.[0];
    if (!file) return;
    // 如果之前有预览图，先释放旧的内存 URL
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(file);
    // 生成一个本地预览用的临时 URL，并保存到状态
    setImagePreview(URL.createObjectURL(file));
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleMint = async () => {
    if (!image || !name) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const imageCID = await uploadToPinata(image);
      const metadata = generateNFTMetadata(name, description, imageCID);
      const metadataCID = await uploadJSONToPinata(metadata);
      const ipfsURI = `ipfs://${metadataCID}`;

      mintNFT(ipfsURI);
    } catch (error) {
      console.error('Error during minting process:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload to IPFS');
    } finally {
      setIsUploading(false);
    }
  };

  const isButtonDisabled =
    !image || !name || isPending || isConfirming || isUploading || isWrongNetwork;

  return (
    <div className={`${silkscreen.className} flex-1`}>
      {isWrongNetwork && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 mx-4 mt-4 rounded">
          <p className="font-bold">{t('wrongNetwork.title')}</p>
          <p className="text-sm">{t('wrongNetwork.message')}</p>
          <button
            onClick={() => switchChain({ chainId: sepolia.id })}
            className="mt-2 bg-yellow-500 text-white px-4 py-1 rounded text-sm"
          >
            {t('wrongNetwork.button')}
          </button>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-16 mt-25 text-center">{t('mainTitle')}</h1>

        {isConnected ? (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">{t('connected.sectionTitle')}</h2>
            <div className="grid grid-cols-6 gap-2 p-6">
              <div className="mb-4 col-span-1 col-start-2">
                <label className="block mb-2">{t('connected.imageLabel')}</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="px-4 py-2 bg-grn-gr hover:bg-grn text-wht rounded"
                >
                  {t('connected.chooseImageButton')}
                </button>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover"
                  />
                )}
              </div>

              <div className="mb-4 col-span-3 col-start-3">
                <label className="block mb-2">{t('connected.nameLabel')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder={t('connected.namePlaceholder')}
                />
              </div>

              <div className="mb-4 col-span-4 col-start-2">
                <label className="block mb-2">{t('connected.descriptionLabel')}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder={t('connected.descriptionPlaceholder')}
                  rows={3}
                />
              </div>

              <button
                onClick={handleMint}
                disabled={isButtonDisabled}
                className="bg-grn-gr hover:bg-grn text-wht px-4 py-2 rounded disabled:bg-wht-md disabled:text-grn-gr col-span-2 col-start-3 justify-self-center"
              >
                {isUploading
                  ? t('connected.mintButton.upLoading')
                  : isPending || isConfirming
                  ? t('connected.mintButton.minting')
                  : t('connected.mintButton.default')}
              </button>

              {uploadError && <p className="mt-2 text-red-500">{t('connected.uploadError')} {uploadError}</p>}

              {error && <p className="mt-2 text-red-500">{t('connected.transactionError')} {error.message}</p>}

              {isSuccess && hash && (
                <p className="mt-2 text-grn">
                  {t('connected.success')}{' '}
                  <a
                    href={`https://sepolia.etherscan.io/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {t('connected.viewOnEtherscan')}
                  </a>
                </p>
              )}
            </div>

            
          </section>
        ) : (
          <section className="mb-12 text-center">
            <p className="text-lg">{t('disconnected.message')}</p>
          </section>
        )}
      </main>
    </div>
  );
}