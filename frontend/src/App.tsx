import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Zap, Search, Lock, Code2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "./lib/supabase";
import { publicClient } from "./lib/viem";

interface AnalysisResult {
  score: number
  riskLevel: "Low" | "Medium" | "High"
  isVerified: boolean
  liquidityLocked: boolean
  ownerRenounced: boolean
  buyTax: number
  sellTax: number
  honeypot: boolean
}

function App() {

  const { isConnected, address } = useAccount()

  const [contractAddress, setContractAddress] = useState("")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])

  const isValidAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr)

  const calculateScore = (data: any) => {

    let score = 100

    if (data.honeypot) score -= 80
    if (!data.liquidityLocked) score -= 30
    if (!data.ownerRenounced) score -= 20
    if (data.buyTax > 10) score -= 20
    if (data.sellTax > 10) score -= 20

    let risk: "Low" | "Medium" | "High" = "Low"

    if (score < 70) risk = "Medium"
    if (score < 40) risk = "High"

    return { score, risk }
  }

  const fetchSecurityData = async (address: string) => {

    try {

      const honeypot = await fetch(
        `https://api.honeypot.is/v2/IsHoneypot?address=${address}`
      ).then(res => res.json())

      return {
        honeypot: honeypot?.IsHoneypot || false,
        liquidityLocked: true,
        ownerRenounced: true,
        buyTax: honeypot?.BuyTax || 0,
        sellTax: honeypot?.SellTax || 0
      }

    } catch {

      return {
        honeypot: false,
        liquidityLocked: false,
        ownerRenounced: false,
        buyTax: 0,
        sellTax: 0
      }

    }

  }

  const analyzeContract = async () => {

    if (!isValidAddress(contractAddress)) {
      toast.error("Invalid contract address")
      return
    }

    setLoading(true)

    const tid = toast.loading("Analyzing contract...")

    try {

      const [bytecode, security] = await Promise.all([
        publicClient.getBytecode({
          address: contractAddress as `0x${string}`
        }),
        fetchSecurityData(contractAddress)
      ])

      const verified = bytecode && bytecode !== "0x"

      const { score, risk } = calculateScore(security)

      const result: AnalysisResult = {
        score,
        riskLevel: risk,
        isVerified: verified,
        liquidityLocked: security.liquidityLocked,
        ownerRenounced: security.ownerRenounced,
        buyTax: security.buyTax,
        sellTax: security.sellTax,
        honeypot: security.honeypot
      }

      setAnalysis(result)

      toast.success("Analysis complete", { id: tid })

      if (isConnected && address) {

        await supabase.from("history").insert([
          {
            wallet_address: address,
            contract_target: contractAddress,
            score: score,
            details: result
          }
        ])

        loadHistory()

      }

    } catch (err) {

      toast.error("Blockchain analysis failed", { id: tid })

    } finally {

      setLoading(false)

    }

  }

  const loadHistory = async () => {

    if (!address) return

    const { data } = await supabase
      .from("history")
      .select("*")
      .eq("wallet_address", address)
      .order("created_at", { ascending: false })

    if (data) setHistory(data)

  }

  useEffect(() => {

    if (isConnected) loadHistory()

  }, [address])

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      <header className="flex items-center justify-between p-4 border-b border-slate-800">

        <div className="flex items-center gap-2">

          <BrainCircuit className="text-sky-500"/>

          <h1 className="font-bold">
            Web3 Risk Monitor
          </h1>

        </div>

        <ConnectButton/>

      </header>

      <main className="max-w-xl mx-auto p-6 space-y-6">

        <div className="bg-slate-900 p-6 rounded-2xl space-y-4">

          <div className="flex gap-2 items-center">
            <Search size={16}/>
            <p className="text-sm">Analyze Smart Contract</p>
          </div>

          <input
            value={contractAddress}
            onChange={(e)=>setContractAddress(e.target.value)}
            placeholder="0x..."
            className="w-full p-3 bg-black border border-slate-700 rounded-xl"
          />

          <button
            onClick={analyzeContract}
            disabled={loading}
            className="w-full bg-sky-600 h-12 rounded-xl flex items-center justify-center gap-2"
          >

            {loading ? "Analyzing..." : <>
              <Zap size={16}/> Start Scan
            </>}

          </button>

        </div>

        <AnimatePresence>

        {analysis && (

          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            className="bg-slate-900 p-6 rounded-2xl space-y-4"
          >

            <div className="text-center">

              <p className="text-sm text-slate-400">
                Safety Score
              </p>

              <div className="text-6xl font-bold text-sky-400">
                {analysis.score}
              </div>

              <p className="text-sm">
                Risk: {analysis.riskLevel}
              </p>

            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">

              <div className="bg-black p-3 rounded-xl flex flex-col items-center">
                <Code2 size={16}/>
                Contract Verified
                {analysis.isVerified ? "Yes":"No"}
              </div>

              <div className="bg-black p-3 rounded-xl flex flex-col items-center">
                <Lock size={16}/>
                Liquidity Locked
                {analysis.liquidityLocked ? "Yes":"No"}
              </div>

              <div className="bg-black p-3 rounded-xl flex flex-col items-center">
                <TrendingUp size={16}/>
                Buy Tax {analysis.buyTax}%
              </div>

              <div className="bg-black p-3 rounded-xl flex flex-col items-center">
                Sell Tax {analysis.sellTax}%
              </div>

            </div>

          </motion.div>

        )}

        </AnimatePresence>

        {history.length > 0 && (

          <div className="bg-slate-900 p-4 rounded-xl">

            <h3 className="text-sm mb-3">
              Recent scans
            </h3>

            {history.slice(0,5).map((h,i)=>(
              <div key={i} className="flex justify-between text-xs p-2 border-b border-slate-800">
                <span>{h.contract_target.slice(0,10)}...</span>
                <span>{h.score}</span>
              </div>
            ))}

          </div>

        )}

      </main>

    </div>

  )

}

export default App
