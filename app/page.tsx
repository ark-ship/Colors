"use client";

import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';

const CONTRACT_ADDRESS = "0x296D4F21f62Ebfad017C1961c88dB3cF7Be5Bb54";

const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "cost",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "quantity", "type": "uint256" }],
    "name": "mint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

export default function MintPage() {
  const { isConnected } = useAccount();
  const [quantity, setQuantity] = useState<number>(1);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: rawPrice, isLoading: isLoadingPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'cost',
  });

  const { data: hash, writeContract, isPending: isMinting, error: mintError } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const mintPriceEth = rawPrice ? formatEther(rawPrice) : "0.00";
  const totalCostWei = rawPrice ? rawPrice * BigInt(quantity) : BigInt(0);

  const handleMint = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'mint',
      args: [BigInt(quantity)],
      value: totalCostWei,
    });
  };

  const getStatusMessage = () => {
    if (mintError) {
      if ((mintError as any).code === 4001 || mintError.message.includes("rejected")) {
        return { text: "Transaction signature denied.", isError: true };
      }
      return { text: "Mint execution failed. Check wallet balance.", isError: true };
    }
    if (isMinting) return { text: "Confirming transaction details...", isError: false };
    if (isConfirming) return { text: "Transaction submitted! Processing on-chain...", isError: false };
    if (isSuccess) return { text: `Successfully minted ${quantity} Onchain Color NFT(s)! 🎉`, isError: false };
    return null;
  };

  const status = getStatusMessage();

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted) return <div className="min-h-screen bg-neutral-950" />;

  return (
    <div className="bg-neutral-950 text-white font-sans min-h-screen flex flex-col justify-between selection:bg-purple-500/30 scroll-smooth">
      
      {/* Sticky Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center sticky top-0 bg-neutral-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img 
            src="/Logo.png" 
            alt="Onchain Color Logo" 
            className="h-9 w-9 object-contain rounded-lg shadow-md shadow-black/50" 
          />
          <span className="text-xl font-bold tracking-wider uppercase bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent hidden sm:block">
            Onchain Color
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('about')} 
            className="text-sm text-neutral-400 hover:text-white transition cursor-pointer hidden md:block"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('mint')} 
            className="text-sm text-neutral-400 hover:text-white transition cursor-pointer hidden md:block"
          >
            Mint Now
          </button>
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center justify-center min-h-[70vh]">
        <div className="relative mb-6">
          <div className="absolute inset-0 rainbow-glass-bg opacity-40 blur-xl rounded-full scale-75 animate-pulse"></div>
          <h2 className="relative text-5xl md:text-7xl font-black tracking-tight uppercase leading-none bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Onchain Color
          </h2>
        </div>
        <p className="text-neutral-400 text-lg md:text-xl max-w-xl mb-10 font-light tracking-wide">
  10,000 unique colors on Ethereum.
</p>
        <button 
          onClick={() => scrollToSection('mint')}
          className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-all duration-300 shadow-xl shadow-white/5 active:scale-95 cursor-pointer tracking-wide"
        >
          Mint Now
        </button>
      </section>

      {/* 2. ABOUT / CONCEPT SECTION */}
      <section id="about" className="w-full bg-neutral-900/30 border-t border-b border-neutral-900/80 py-20">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
  <h3 className="text-2xl font-medium tracking-wide mb-4">The Concept</h3>
  <div className="text-neutral-400 text-sm leading-relaxed space-y-4">
    <p>
      We created Onchain Color as an exploration of absolute simplicity. We decided to step back and focus entirely on the most fundamental element of visual expression pure color.
    </p>
    <p>
      This collection consists of exactly 10,000 unique colors, each permanently embedded on Ethereum. We stripped away everything unnecessary to ensure that nothing distracts from the pure hue of each individual piece.
    </p>
  </div>
</div>
          {/* Decorative Art Grid Preview */}
          <div className="grid grid-cols-3 gap-3 p-2 bg-neutral-900/50 rounded-2xl border border-neutral-800/60">
            <div className="aspect-square rounded-lg bg-gradient-to-br from-red-500 to-purple-600 animate-pulse"></div>
            <div className="aspect-square rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400"></div>
            <div className="aspect-square rounded-lg bg-gradient-to-br from-yellow-400 to-pink-500"></div>
            <div className="aspect-square rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600"></div>
            <div className="aspect-square rounded-lg rainbow-glass-bg"></div>
            <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-800 to-fuchsia-500"></div>
          </div>
        </div>
      </section>

      {/* 3. MAIN MINTING SECTION */}
      <section id="mint" className="flex-1 flex flex-col items-center justify-center px-4 py-24 scroll-mt-24">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest text-purple-400 uppercase bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            Live Station
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight mt-3">Execute Live Mint</h3>
        </div>

        <div className="relative p-[1px] rounded-3xl overflow-hidden shadow-[0_0_50px_-10px_rgba(168,85,247,0.2)] max-w-md w-full">
          <div className="absolute inset-0 rainbow-glass-bg opacity-25 blur-xl pointer-events-none"></div>
          <div className="absolute inset-0 rainbow-glass-bg opacity-75"></div>
          
          <div className="relative bg-neutral-950/85 backdrop-blur-2xl rounded-[23px] p-8 md:p-10 flex flex-col items-center text-center">

            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Onchain Color</h1>
            <p className="text-neutral-400 text-sm max-w-xs mb-8">
              Just Color. Fully Onchain.
            </p>

            <div className="w-full grid grid-cols-2 gap-4 border-t border-b border-neutral-800/60 py-4 mb-8 text-left">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider">Price</p>
                <p className="text-lg font-medium text-neutral-200">
                  {isLoadingPrice ? "Loading..." : `${mintPriceEth} ETH`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-500 uppercase tracking-wider">Status</p>
                <p className="text-lg font-medium text-emerald-400">Live</p>
              </div>
            </div>

            <div className="w-full flex justify-between items-center bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-2 mb-6">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="text-neutral-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center transition cursor-pointer"
              >
                −
              </button>
              <span className="text-lg font-semibold w-12">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(10, q + 1))}
                className="text-neutral-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center transition cursor-pointer"
              >
                +
              </button>
            </div>

            {isConnected ? (
              <button 
                onClick={handleMint}
                disabled={isMinting || isConfirming || isLoadingPrice}
                className="w-full py-4 rounded-xl text-black font-semibold tracking-wide bg-white hover:bg-neutral-100 disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-lg shadow-white/5 active:scale-[0.99] transition-all duration-200 cursor-pointer"
              >
                {isMinting || isConfirming ? "Processing..." : "Mint NFT"}
              </button>
            ) : (
              <div className="w-full flex justify-center">
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button
                      onClick={openConnectModal}
                      className="w-full py-4 rounded-xl text-black font-semibold tracking-wide bg-white hover:bg-neutral-100 shadow-lg shadow-white/5 transition-all duration-200 cursor-pointer"
                    >
                      Connect Wallet to Mint
                    </button>
                  )}
                </ConnectButton.Custom>
              </div>
            )}

            {status && (
              <p className={`text-xs mt-4 min-h-[16px] transition-all duration-300 ${status.isError ? 'text-red-400' : 'text-neutral-400'}`}>
                {status.text}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Modern Updated Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-neutral-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 tracking-wide">
        <div>
          &copy; 2026 Onchain Color. All Rights Reserved.
        </div>
        <div className="flex items-center gap-5">
          {/* X (Twitter) Link */}
          <a 
            href="https://x.com/OnchainColor" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-neutral-500 hover:text-white transition-colors duration-200"
            aria-label="Follow us on X"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          {/* OpenSea Link */}
          <a 
            href="https://opensea.io/collection/onchain-color" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] uppercase font-bold tracking-widest border border-neutral-800 px-2.5 py-1 rounded bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all duration-200"
            aria-label="View on OpenSea"
          >
            OpenSea
          </a>
        </div>
      </footer>
    </div>
  );
}