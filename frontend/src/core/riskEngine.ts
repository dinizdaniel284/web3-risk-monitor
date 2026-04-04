export function calculateRisk(bytecode: string | undefined) {
  let score = 50
  const signals: string[] = []

  if (!bytecode || bytecode === "0x") {
    score = 10
    signals.push("Contrato vazio ou não encontrado")
  } else {
    score += 30
    signals.push("Contrato possui bytecode válido")

    if (bytecode.length < 500) {
      score -= 20
      signals.push("Bytecode muito pequeno (possível risco)")
    }

    if (bytecode.includes("delegatecall")) {
      score -= 15
      signals.push("Uso de delegatecall detectado")
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    signals
  }
}
