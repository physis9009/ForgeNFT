'use client';

import { useState } from 'react';
import contractABI from '@/src/abi/ForgeNFT.json';
import Link from 'next/link';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyAddressMsg, setCopyAddressMsg] = useState<string | null>(null);
  const [copyAbiMsg, setCopyAbiMsg] = useState<string | null>(null);

  const contractAddr = "0x7c8894063d6Da235e4BFC7e2BCF6FC4EaF96d40B";

  const handleCopyAddress = async (address: string, label: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopyAddressMsg(`${label} copied!`);
      setTimeout(() => setCopyAddressMsg(null), 1500);
    } catch (err) {
      setCopyAddressMsg("Failed to copy");
      setTimeout(() => setCopyAddressMsg(null), 1500);
    }
  };

  const handleCopyAbi = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(contractABI, null, 2));
      setCopyAbiMsg("Copied!");
      setTimeout(() => setCopyAbiMsg(null), 1500);
    } catch (err) {
      setCopyAbiMsg("Failed to copy");
      setTimeout(() => setCopyAbiMsg(null), 1500);
    }
  };

  const handleDownloadAbi = () => {
    const blob = new Blob([JSON.stringify(contractABI, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contract.abi.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <footer className="bg-wht-gr text-blk-gr mt-auto bottom-0">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-evenly gap-6">
            <div className="flex-1 min-w-50 max-w-100">
              <h3 className="text-sm font-semibold mb-3 border-l-3 pl-2 border-grn">
                📜 Core Contracts
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs w-[17]">Main :</span>
                  <code className="px-2 py-0.5 rounded text-xs font-mono break-all max-w-[50] md:max-w-[62]">
                    {contractAddr}
                  </code>
                  <button
                    onClick={() => handleCopyAddress(contractAddr, "Main contract")}
                    className="bg-grn-gr hover:bg-grn transition text-wht-md text-sm px-1 border-wht-md rounded-sm"
                    title="Copy address"
                  >
                    Copy address
                  </button>
                  <Link
                    href={`https://etherscan.io/address/${contractAddr}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-grn-gr hover:text-grn transition text-sm px-1"
                    title="View on Etherscan"
                  >
                    View on Etherscan
                  </Link>
                </div>
                
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-3 bg-grn-gr hover:bg-grn text-wht-md text-xs font-medium px-3 py-1.5 rounded-sm transition border-wht-md"
              >
                Download / Copy ABI
              </button>
              {copyAddressMsg && (
                <div className="text-xs text-grn mt-2">{copyAddressMsg}</div>
              )}
            </div>

            <div className="flex-1 min-w-50 max-w-70">
              <h3 className="text-sm font-semibold mb-3 border-l-3 pl-2 border-grn">
                🔗 Resources
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="https://github.com/physis9009/ForgeNFT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-grn-gr hover:text-grn transition inline-flex items-center gap-1"
                  >
                    📦 GitHub Repository
                  </Link>
                </li>
                <li>
                  <Link
                    href="9009wwb@gmail.com"
                    className="text-grn-gr hover:text-grn transition inline-flex items-center gap-1"
                  >
                    📧 Developer Email
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/physis9009/ForgeNFT/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-grn-gr hover:text-grn transition inline-flex items-center gap-1"
                  >
                    🐛 Report Issue
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex-1 min-w-50 max-w-70">
              <h3 className="text-sm font-semibold mb-3 border-l-3 pl-2 border-grn">
                ⚖️ License
              </h3>
              <p className="text-sm mb-1">
                <Link
                  href="https://github.com/your-org/your-dapp/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-grn-gr hover:text-grn transition"
                >
                  MIT License
                </Link>
              </p>
              <p className="text-xs text-grn-gr mt-3">DApp v2.3.0</p>
              <p className="text-xs text-grn-gr">© 2025 Your DApp Name</p>
            </div>
          </div>
        </div>
      </footer>

      {/* ABI Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-wht-md/90 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto border border-wht-gr">
            <div className="sticky top-0 bg-wht-md/90 px-5 border-blk-gr flex justify-between items-center">
              <h3 className="text-blk-md font-semibold">Contract ABI (JSON)</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-pnk-gr hover:text-pnk text-xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="px-5">
              <pre className="bg-blk/90 text-wht-gr rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all max-h-80">
                {JSON.stringify(contractABI, null, 2)}
              </pre>
              <div className="flex gap-3 justify-end mt-4">
                <button
                  onClick={handleCopyAbi}
                  className="bg-grn-gr hover:bg-grn text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Copy ABI
                </button>
                <button
                  onClick={handleDownloadAbi}
                  className="bg-grn-gr hover:bg-grn text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Download JSON
                </button>
              </div>
              {copyAbiMsg && (
                <div className="text-xs text-grn text-right mt-2">{copyAbiMsg}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}