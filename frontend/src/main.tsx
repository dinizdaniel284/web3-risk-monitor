import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import './i18n/index'; 

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'Agencia IA Diniz',
  projectId: '934988f0169128537b0c804b321894d0', 
  chains: [mainnet, polygon, sepolia],
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);