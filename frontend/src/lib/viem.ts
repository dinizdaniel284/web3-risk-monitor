import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://eth.drpc.org"), // Troque para este! O dRPC é excelente para evitar o erro 429.
  batch: {
    multicall: true 
  }
});