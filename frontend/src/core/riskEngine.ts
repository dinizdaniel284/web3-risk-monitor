export function analyzeSmartContract(bytecode: string | undefined) {
  let score = 50;
  const signals: { label: string; value: string }[] = [];

  if (!bytecode || bytecode === "0x") {
    score = 10;
    signals.push({ label: "Status", value: "Contrato vazio ou não encontrado" });
  } else {
    score += 30;
    signals.push({ label: "Bytecode", value: "Válido detectado" });

    if (bytecode.length < 500) {
      score -= 20;
      signals.push({ label: "Tamanho", value: "Muito pequeno (Possível Risco)" });
    }

    if (bytecode.includes("delegatecall")) {
      score -= 15;
      signals.push({ label: "Segurança", value: "Uso de delegatecall detectado" });
    }
    
    // Bônus: verifica se o contrato é muito complexo
    if (bytecode.length > 5000) {
      score += 10;
      signals.push({ label: "Complexidade", value: "Alta (Contrato Robusto)" });
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    signals
  };
}
