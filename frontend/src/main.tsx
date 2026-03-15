import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme
} from "@rainbow-me/rainbowkit";

import { WagmiProvider } from "wagmi";
import { mainnet, polygon, sepolia } from "wagmi/chains";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";

import "./i18n/index";
import i18n from "./i18n/index";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "Agencia IA Diniz",
  projectId: "934988f0169128537b0c804b321894d0",
  chains: [mainnet, polygon, sepolia],
  ssr: false
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme()}
          modalSize="compact"
          locale={i18n.language === "pt" ? "pt-BR" : "en-US"}
        >
          <App />

          <Toaster
            richColors
            position="top-right"
            closeButton
          />

        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
