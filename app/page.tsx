'use client';

import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import MintCard from '../components/MintCard';

export default function Home() {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col justify-between bg-black p-6 overflow-hidden">
      
      
      <style jsx global>{`
        @keyframes floatSlow1 {
          0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
          33% { transform: translate(10vw, 20vh) rotate(120deg) scale(1.2); }
          66% { transform: translate(-5vw, 40vh) rotate(240deg) scale(0.8); }
          100% { transform: translate(0px, 0px) rotate(360deg) scale(1); }
        }
        @keyframes floatSlow2 {
          0% { transform: translate(0px, 0px) rotate(360deg) scale(1.1); }
          33% { transform: translate(-15vw, 30vh) rotate(240deg) scale(0.9); }
          66% { transform: translate(10vw, 10vh) rotate(120deg) scale(1.3); }
          100% { transform: translate(0px, 0px) rotate(0deg) scale(1.1); }
        }
        @keyframes floatSlow3 {
          0% { transform: translate(0px, 0px) rotate(180deg) scale(1); }
          50% { transform: translate(15vw, -15vh) rotate(0deg) scale(1.2); }
          100% { transform: translate(0px, 0px) rotate(180deg) scale(1); }
        }
        .animate-blob-1 { animation: floatSlow1 25s infinite linear; }
        .animate-blob-2 { animation: floatSlow2 30s infinite linear; }
        .animate-blob-3 { animation: floatSlow3 22s infinite linear; }
      `}</style>

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#000_90%)] z-[1]" />

        
        <div className="absolute top-[-10%] left-[5%] w-[600px] h-[220px] rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-25 blur-[120px] transform rotate-12 animate-blob-1" />

        
        <div className="absolute top-[30%] right-[-10%] w-[700px] h-[180px] rounded-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-blue-600 opacity-20 blur-[130px] transform -rotate-45 animate-blob-2" />

        
        <div className="absolute bottom-[-5%] left-[20%] w-[550px] h-[250px] rounded-full bg-gradient-to-r from-fuchsia-600 via-rose-500 to-amber-500 opacity-15 blur-[110px] transform rotate-45 animate-blob-3" />
      </div>

      {/* Header / Navigation */}
      <nav className="w-full py-4 flex justify-between items-center max-w-7xl mx-auto z-20">
        <div className="flex items-center space-x-3">
          <img src="/Logo.png" alt="Onchain Color Logo" className="h-8 w-auto object-contain" />
          <span className="text-xl tracking-widest font-light text-zinc-300 hidden sm:inline">
            ONCHAIN COLOR
          </span>
        </div>
        <button 
          onClick={() => open()}
          className="px-6 py-2 rounded-full border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 transition-all text-sm font-medium backdrop-blur-md"
        >
          {mounted && isConnected ? 'Wallet Connected' : 'Connect Wallet'}
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center w-full my-12">
        {mounted ? (
          <MintCard />
        ) : (
          <div className="max-w-md w-full h-[520px] bg-zinc-900/10 border border-white/5 rounded-3xl animate-pulse" />
        )}
      </div>

      {/* Elegant Footer Section */}
      <footer className="w-full py-6 flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto border-t border-white/5 z-20 text-xs tracking-widest text-zinc-500 gap-4 backdrop-blur-sm">
        <div className="font-light uppercase">
          © 2026 onchain color all rights reserved
        </div>
        
        <div className="flex space-x-8 font-medium">
          <a 
            href="https://x.com/OnchainColor" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors duration-200 uppercase"
          >
            X (Twitter)
          </a>
          <a 
            href="https://opensea.io/collection/onchain-color" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors duration-200 uppercase"
          >
            OpenSea
          </a>
        </div>
      </footer>
      
    </main>
  );
}