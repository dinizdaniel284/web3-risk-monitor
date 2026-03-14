import { createPublicClient, http } from 'viem';
import { mainnet, polygon, sepolia } from 'viem/chains';

// Criamos o cliente que vai "conversar" com a blockchain
export const publicClient = createPublicClient({
  chain: mainnet, // Você pode mudar para sepolia ou polygon depois
  transport: http(import.meta.env.VITE_ALCHEMY_RPC_URL) 
});
