export function analyzeSmartContract(bytecode: string | undefined) {
  let score = 50;
  // Ajustei para retornar objetos com 'label' e 'value' como o App.tsx espera no map
  const signals: { label: string; value: string }[] = [];

  if (!bytecode || bytecode === "0x") {
    score = 10;
    signals.push({ label: "Status", value: "Contrato vazio ou não encontrado" });
  } else {
    score += 30;
    signals.push({ label: "Bytecode", value: "Detectado e Válido" });

    if (bytecode.length < 500) {
      score -= 20;
      signals.push({ label: "Tamanho", value: "Muito curto (Risco)" });
    }

    if (bytecode.includes("delegatecall")) {
      score -= 15;
      signals.push({ label: "Segurança", value: "Delegatecall detectado" });
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    signals
  };
}