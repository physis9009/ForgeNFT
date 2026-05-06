'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

function Page() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const isWrongNetwork = isConnected && chainId !== baseSepolia.id;

  return (
    <div className="min-h-screen">
      <header className="p-4 flex justify-end">
        <ConnectButton />
      </header>

      {isWrongNetwork && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 mx-4 mt-4 rounded">
          <p className="font-bold">Wrong Network</p>
          <p className="text-sm">Please switch to Base Sepolia testnet</p>
          <button
            onClick={() => switchChain({ chainId: baseSepolia.id })}
            className="mt-2 bg-yellow-500 text-white px-4 py-1 rounded text-sm"
          >
            Switch to Base Sepolia
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
              <p className="mb-4">Upload image and fill details to mint your NFT</p>
              <button className="bg-blue-500 text-white px-6 py-2 rounded">
                Mint NFT
              </button>
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