// src/lib/viem.ts
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// Tenta carregar a chave do Alchemy do arquivo .env
const rpcUrl = import.meta.env.VITE_ALCHEMY_RPC_URL;

export const publicClient = createPublicClient({
  chain: mainnet,
  // Se não houver chave no .env, usa o RPC público e estável da Cloudflare como Plano B
  transport: http(rpcUrl || 'https://cloudflare-eth.com', {
    timeout: 4000 // Se a requisição demorar mais de 4 segundos, corta para acionar nossa simulação local
  })
});