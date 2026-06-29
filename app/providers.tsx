'use client';

import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const projectId = '59fadeef2d23920bdf1da920bc0ed472';

const metadata = {
  name: 'Onchain Color',
  description: 'Elegant onchain color NFT minting',
  url: 'https://yourwebsite.com', 
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mainnet, sepolia] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

const queryClient = new QueryClient();

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#ffffff',
    '--w3m-color-mix': '#000000',
    '--w3m-color-mix-strength': 40,
  }
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}