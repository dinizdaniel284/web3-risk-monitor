import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

// 🌍 i18n
import "./i18n/index";
import i18n from "./i18n/index";

import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme
} from "@rainbow-me/rainbowkit";

import { WagmiProvider } from "wagmi";
import { mainnet, polygon, sepolia } from "wagmi/chains";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "Agencia IA Diniz",
  projectId: "934988f0169128537b0c804b321894d0",
  chains: [mainnet, polygon, sepolia],
  ssr: false
});

// 🔥 WRAPPER INTELIGENTE (resolve bug de idioma)
function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState(i18n.language);

  React.useEffect(() => {
    const onLangChange = (lng: string) => {
      setLang(lng);
    };

    i18n.on("languageChanged", onLangChange);

    return () => {
      i18n.off("languageChanged", onLangChange);
    };
  }, []);

  return (
    <RainbowKitProvider
      key={lang} // 🔥 força re-render ao trocar idioma
      theme={darkTheme()}
      modalSize="compact"
      locale={lang === "pt" ? "pt-BR" : "en-US"}
    >
      {children}
    </RainbowKitProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        
        <Providers>
          <App />

          <Toaster
            richColors
            position="top-right"
            closeButton
          />
        </Providers>

      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
