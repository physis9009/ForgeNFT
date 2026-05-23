# ⚒️ ForgeNFT

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.7-000000?logo=next.js)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.24-363636?logo=solidity)](https://soliditylang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Demo-forge--nft--rho.vercel.app-00D9FF?logo=vercel)](https://forge-nft-rho.vercel.app)

**Create, collect, and burn NFTs on the blockchain—all from an intuitive web interface**

---

## 🎯 Overview

ForgeNFT is a full-stack NFT minting application that combines a modern React/Next.js frontend with a custom Solidity smart contract. It allows users to seamlessly connect their wallets, mint custom NFTs with metadata, and manage their collections across multiple blockchain networks. This project demonstrates production-grade web3 integration, responsive UI design, and smart contract development.

---

## ✨ Key Features

- **🔗 Multi-Chain Wallet Integration** — Connect via MetaMask and other EVM wallets across Ethereum, Polygon, Optimism, Arbitrum, Base, and Sepolia testnet
- **🎨 NFT Minting** — Mint NFTs with custom metadata and IPFS image URIs with a single transaction
- **🔥 Burn Management** — Allow users to burn their NFTs directly from the interface with transaction confirmation
- **📱 Responsive Design** — Masonry gallery layout for elegant NFT display on all devices
- **🌍 Internationalization (i18n)** — Multi-language support with Next.js next-intl middleware
- **🎭 Modal Gallery View** — Click any NFT to view full details, descriptions, and metadata
- **⛓️ Smart Contract Architecture** — ERC721 with URI storage, enumeration, and burnable extensions from OpenZeppelin
- **🔐 TypeScript First** — Full type safety across frontend and backend

---

## 🛠️ Tech Stack

**Frontend:**
- **Next.js 15** — React meta-framework with server & client components, SSR support
- **React 19** — Modern UI library with hooks and concurrent features
- **TypeScript 5.5** — Static type checking for robust development
- **Tailwind CSS 4** — Utility-first styling with autoprefixer
- **wagmi 2** — Ethereum React hooks library for blockchain interactions
- **RainbowKit 2** — Wallet connection UI and account management
- **TanStack React Query 5** — Data fetching and state management
- **next-intl 4** — Internationalization framework for multi-language support

**Smart Contracts:**
- **Solidity ^0.8.24** — Modern Ethereum smart contract language
- **OpenZeppelin Contracts 5** — Battle-tested contract standards (ERC721, Ownable, URIStorage)
- **Hardhat 3** — Ethereum development environment and testing framework

**Web3 Infrastructure:**
- **Viem 2.38** — Lightweight Ethereum interaction library
- **Async Storage** — Persistent client-side data storage

---

## 🏗️ Design & Technical Decisions

### Smart Contract Design
The `ForgeNFT.sol` contract implements ERC721 with three critical extensions:
- **ERC721URIStorage** — Stores unique metadata URIs per token, enabling custom images and descriptions
- **ERC721Enumerable** — Enables efficient querying of total supply and user collections
- **ERC721Burnable** — Allows token holders to permanently burn their NFTs
- **Ownable** — Restricts max supply adjustment to contract owner, preventing unlimited minting

The contract validates max supply constraints on mint and enforces safe minting to prevent silent failures.

### Frontend Architecture
- **Localized Routing** — Dynamic `[locale]` segment routes requests through i18n middleware, automatically detecting user language
- **Custom Hooks** — Separation of concerns with `useMintNFT`, `useBurnNFT`, and `useUserNFTs` hooks encapsulating blockchain logic
- **RainbowKit Provider** — Configured for multi-chain support with automatic chain detection
- **Responsive Components** — `NFTCard` component with modal previews, lazy loading, and graceful fallbacks for missing metadata

### Interesting Implementation Details
1. **Metadata Resolution** — The `useUserNFTs` hook fetches on-chain token URIs and resolves IPFS metadata, handling both successful and missing image scenarios
2. **User Gallery Pattern** — Masonry layout displays user-owned NFTs in a collage-style gallery with one-click modal viewing
3. **Transaction State Management** — Loading states for mint and burn operations with disabled buttons during pending transactions
4. **Internationalization Middleware** — Seamlessly routes requests through language detection, supporting multiple locales without URL duplication

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- A Web3 wallet (MetaMask recommended)

### Installation
```bash
# Clone the repository
git clone https://github.com/physis9009/ForgeNFT.git
cd ForgeNFT

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Connect your wallet and start minting!

---

## 📁 Project Structure

```
ForgeNFT/
├── contracts/
│   └── ForgeNFT.sol              # ERC721 smart contract with mint, burn, and supply management
├── src/
│   ├── app/
│   │   └── [locale]/             # i18n-aware app directory with dynamic routing
│   │       ├── (mint)/           # Minting interface pages
│   │       ├── layout.tsx        # Root layout with metadata and styling
│   │       └── providers.tsx     # Wagmi and RainbowKit providers
│   ├── components/
│   │   ├── NFTCard.tsx          # Gallery card component with modal preview
│   │   ├── footer.tsx           # Footer with social links and language selector
│   │   └── navLinks.tsx         # Navigation component
│   ├── hooks/
│   │   ├── useMintNFT.ts        # Hook for minting transactions
│   │   ├── useBurnNFT.ts        # Hook for burning transactions
│   │   └── useUserNFTs.ts       # Hook for fetching and parsing user's NFT collection
│   ├── config/                  # Blockchain configuration
│   ├── i18n/                    # Internationalization config
│   ├── lib/                     # Utility functions
│   ├── abi/                     # Contract ABIs
│   ├── types/                   # TypeScript type definitions
│   ├── styles/                  # Global CSS and Tailwind config
│   ├── middleware.ts            # Next.js middleware for i18n routing
│   └── wagmi.ts                 # Wagmi client configuration with multi-chain support
├── messages/                    # i18n translation files
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact & Acknowledgments

**Built by:** [physis9009](https://github.com/physis9009)  
**Email:** 9009wwb@gmail.com

**Acknowledgments:**
- [RainbowKit](https://rainbowkit.com) — Excellent wallet connection library
- [wagmi](https://wagmi.sh) — Powerful Ethereum React hooks
- [OpenZeppelin](https://www.openzeppelin.com/) — Industry-standard smart contract libraries
- [Next.js](https://nextjs.org/) — Modern React framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework

---

**[View on GitHub](https://github.com/physis9009/ForgeNFT) • [Live Demo](https://forge-nft-rho.vercel.app)**
