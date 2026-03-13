import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from 'sonner';
import './i18n/index'; 

const queryClient = new QueryClient();

// Configuração otimizada para MetaMask e novas versões
const config = getDefaultConfig({
  appName: 'Agencia IA Diniz',
  projectId: '934988f0169128537b0c804b321894d0', 
  chains: [mainnet, polygon, sepolia],
  ssr: false, // Desativa SSR para evitar conflito de hidratação com a MetaMask
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* Adicionei o Provider aqui com um tema escuro para combinar com seu app */}
        <RainbowKitProvider theme={darkTheme()} modalSize="compact">
          <App />
          <Toaster richColors position="top-right" closeButton />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
        
