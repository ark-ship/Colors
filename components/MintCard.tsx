'use client';

import { useState, useEffect } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, contractAbi } from '../lib/contract';

export default function MintCard() {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Read Live Mint Progress from Contract
  const { data: totalSupply, refetch: refetchTotalSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: 'totalSupply',
  });

  const { data: maxSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: 'MAX_SUPPLY',
  });

  const { data: mintPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: 'mintPrice',
  });

  const { data: isMintOpen } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: 'mintOpen',
  });

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash,
      // Refetch total supply once transaction is confirmed to update the UI
      onSuccess: () => refetchTotalSupply() 
    });

  // Safe data parsing
  const currentMinted = totalSupply ? Number(totalSupply) : 0;
  const maxSupplyCount = maxSupply ? Number(maxSupply) : 10000; 
  const progressPercent = Math.min(100, (currentMinted / maxSupplyCount) * 100);

  const handleMint = async () => {
    if (!mintPrice) return;
    
    const totalPrice = BigInt(mintPrice.toString()) * BigInt(quantity);

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractAbi,
      functionName: 'mint',
      args: [BigInt(quantity)],
      value: totalPrice,
    });
  };

  return (
    <div className="max-w-md w-full bg-zinc-900/30 border border-white/10 p-10 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col items-center text-center z-10">
      
      {/* Logo Container */}
      <div className="w-32 h-32 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center p-4 mb-8 shadow-2xl">
        <img src="/Logo.png" alt="Onchain Color" className="w-full h-full object-contain" />
      </div>
      
      <h2 className="text-3xl font-light mb-2">Claim Your Color</h2>
      <p className="text-zinc-400 mb-6 text-sm">
        A purely onchain aesthetic experience.
      </p>

      {/* 2. Elegant Progress Tracker */}
      <div className="w-full mb-8 text-left space-y-2">
        <div className="flex justify-between text-xs tracking-wider text-zinc-400 uppercase font-medium">
          <span>Collection Progress</span>
          <span className="font-mono text-zinc-200">
            {mounted ? `${currentMinted.toLocaleString()} / ${maxSupplyCount.toLocaleString()}` : '... / 10,000'}
          </span>
        </div>
        <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden p-[1px] border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-zinc-500 via-zinc-200 to-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            style={{ width: `${mounted ? progressPercent : 0}%` }}
          />
        </div>
      </div>

      <div className="w-full space-y-6">
        {/* Quantity Controls (With a max cap of 20) */}
        <div className="flex justify-between items-center bg-black/50 p-4 rounded-xl border border-zinc-800">
          <span className="text-zinc-400">Quantity</span>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-zinc-500 hover:text-white transition-colors text-xl w-6"
            >-</button>
            <span className="font-mono text-lg w-8 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(Math.min(20, quantity + 1))} // Max limit set to 20
              className="text-zinc-500 hover:text-white transition-colors text-xl w-6"
            >+</button>
          </div>
        </div>

        {/* Action Button */}
        {!mounted ? (
          <button disabled className="w-full py-4 rounded-xl bg-zinc-800/50 text-zinc-500 font-semibold animate-pulse">
            Loading...
          </button>
        ) : !isConnected ? (
          <button 
            onClick={() => open()}
            className="w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
          >
            Connect Wallet to Mint
          </button>
        ) : !isMintOpen ? (
          <button disabled className="w-full py-4 rounded-xl bg-zinc-800 text-zinc-500 font-semibold cursor-not-allowed">
            Minting is Closed
          </button>
        ) : (
          <button 
            onClick={handleMint}
            disabled={isPending || isConfirming}
            className="w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors disabled:bg-zinc-600 disabled:text-zinc-400"
          >
            {isPending ? 'Confirm in Wallet...' : 
             isConfirming ? 'Minting...' : 
             `Mint ${quantity}`}
          </button>
        )}

        {isConfirmed && (
          <div className="mt-4 p-4 rounded-lg bg-green-950/30 border border-green-900/50 text-green-400 text-sm">
            Successfully minted!
          </div>
        )}
      </div>
    </div>
  );
}