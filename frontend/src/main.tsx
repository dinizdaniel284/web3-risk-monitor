import React, { useState, useEffect } from "react";
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

// Importa a instância do i18n configurada
import i18n from "./i18n/index";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "Agencia IA Diniz", // Mantendo o branding oficial do sistema
  projectId: "934988f0169128537b0c804b321894d0",
  chains: [mainnet, polygon, sepolia],
  ssr: false
});

// Componente Wrapper para gerenciar a re-renderização do idioma do RainbowKit dinamicamente
function Root() {
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    // Escuta quando o método i18n.changeLanguage() for disparado no dropdown
    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng);
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme()}
          modalSize="compact"
          locale={currentLang === "pt" ? "pt-BR" : "en-US"}
          key={currentLang} // A key força o componente a atualizar os textos internos imediatamente
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
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);