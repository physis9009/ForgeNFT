'use client';

import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { useMintNFT } from '@/src/hooks/useMintNFT';
import { useUserNFTs } from '@/src/hooks/useUserNFTs';
import { NFTCard } from '@/src/components/NFTCard';
import { useState } from 'react';
import { uploadToPinata, uploadJSONToPinata } from '@/src/lib/ipfs';
import { generateNFTMetadata } from '@/src/lib/metadata';

export default function Page() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { mintNFT, isPending, isConfirming, isSuccess, error, hash } = useMintNFT();
  const { userNFTs, isLoadingNFTs, balance } = useUserNFTs();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isWrongNetwork = isConnected && chainId !== sepolia.id;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMint = async () => {
    if (!image || !name) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Step 1: Upload image to IPFS
      const imageCID = await uploadToPinata(image);

      // Step 2: Generate NFT metadata
      const metadata = generateNFTMetadata(name, description, imageCID);

      // Step 3: Upload metadata to IPFS
      const metadataCID = await uploadJSONToPinata(metadata);

      // Step 4: Create IPFS URI
      const ipfsURI = `ipfs://${metadataCID}`;

      // Step 5: Mint NFT with IPFS URI
      mintNFT(ipfsURI);
    } catch (error) {
      console.error('Error during minting process:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload to IPFS');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {isWrongNetwork && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 mx-4 mt-4 rounded">
          <p className="font-bold">Wrong Network</p>
          <p className="text-sm">Please switch to Sepolia testnet</p>
          <button
            onClick={() => switchChain({ chainId: sepolia.id })}
            className="mt-2 bg-yellow-500 text-white px-4 py-1 rounded text-sm"
          >
            Switch to Sepolia
          </button>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">ForgeNFT</h1>
          <p className="text-lg text-gray-600">Mint your unique NFT</p>
        </section>

        {isConnected ? (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Start Minting</h2>
            <div className="border rounded-lg p-6">
              <div className="mb-4">
                <label className="block mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover"
                  />
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="NFT Name"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="NFT Description"
                  rows={3}
                />
              </div>

              <button
                onClick={handleMint}
                disabled={!image || !name || isPending || isConfirming || isUploading}
                className="bg-blue-500 text-white px-6 py-2 rounded disabled:bg-gray-400"
              >
                {isUploading ? 'Uploading to IPFS...' : isPending || isConfirming ? 'Minting...' : 'Mint NFT'}
              </button>

              {uploadError && (
                <p className="mt-2 text-red-500">
                  Upload Error: {uploadError}
                </p>
              )}

              {error && (
                <p className="mt-2 text-red-500">
                  Error: {error.message}
                </p>
              )}

              {isSuccess && hash && (
                <p className="mt-2 text-green-500">
                  Success! Transaction:{' '}
                  <a
                    href={`https://sepolia.etherscan.io/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {hash}
                  </a>
                </p>
              )}
            </div>
          </section>
        ) : (
          <section className="mb-12 text-center">
            <p className="text-lg">Please connect wallet to start minting</p>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-6">
            {isConnected ? 'My NFTs' : 'Recent Mints'}
          </h2>

          {isConnected ? (
            <>
              {isLoadingNFTs ? (
                <p className="text-center text-gray-600">Loading your NFTs...</p>
              ) : userNFTs.length > 0 ? (
                <>
                  <p className="mb-4 text-gray-600">
                    You own {userNFTs.length} NFT{userNFTs.length !== 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {userNFTs.map((nft) => (
                      <NFTCard key={nft.tokenId.toString()} nft={nft} />
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-600">
                  You haven't minted any NFTs yet. Start minting above!
                </p>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="aspect-square bg-gray-200 mb-4"></div>
                  <h3 className="font-semibold">NFT #{i}</h3>
                  <p className="text-sm text-gray-600">Sample NFT description</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}