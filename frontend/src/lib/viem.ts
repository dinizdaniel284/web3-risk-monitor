import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://cloudflare-eth.com"), // 👈 RPC pública muito mais estável
})
