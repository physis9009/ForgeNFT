'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { useMintNFT } from '@/src/hooks/useMintNFT';
import { useState } from 'react';

function Page() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { mintNFT, isPending, isConfirming, isSuccess, error, hash } = useMintNFT();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const isWrongNetwork = isConnected && chainId !== sepolia.id;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMint = () => {
    if (!image || !name) return;

    // For now, use a placeholder URI
    // In the next step, we'll upload to IPFS and get the real URI
    const placeholderURI = `ipfs://placeholder/${name}`;
    mintNFT(placeholderURI);
  };

  return (
    <div className="min-h-screen">
      <header className="p-4 flex justify-end">
        <ConnectButton />
      </header>

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
                disabled={!image || !name || isPending || isConfirming}
                className="bg-blue-500 text-white px-6 py-2 rounded disabled:bg-gray-400"
              >
                {isPending || isConfirming ? 'Minting...' : 'Mint NFT'}
              </button>

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
          <h2 className="text-2xl font-semibold mb-6">Recent Mints</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="aspect-square bg-gray-200 mb-4"></div>
                <h3 className="font-semibold">NFT #{i}</h3>
                <p className="text-sm text-gray-600">Sample NFT description</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Page;