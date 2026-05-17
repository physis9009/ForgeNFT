'use client';

import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { useMintNFT } from '@/src/hooks/useMintNFT';
import { useUserNFTs } from '@/src/hooks/useUserNFTs';
import { NFTCard } from '@/src/components/NFTCard';
import { useState } from 'react';
import { uploadToPinata, uploadJSONToPinata } from '@/src/lib/ipfs';
import { generateNFTMetadata } from '@/src/lib/metadata';

export default function GalleryPage() {
    const { isConnected } = useAccount();
    const chainId = useChainId();
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
        <main>
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
        </main>
    );
}