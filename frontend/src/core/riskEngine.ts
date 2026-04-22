export function analyzeSmartContract(bytecode: string) {
  const signals = [];
  let riskPoints = 0;

  if (bytecode.includes("ff")) {
    signals.push({ label: "Self-Destruct", value: "signals.self_destruct" });
    riskPoints += 40;
  }
  if (bytecode.includes("f4")) {
    signals.push({ label: "DelegateCall", value: "signals.delegate_call" });
    riskPoints += 20;
  }
  if (bytecode.includes("5b600080fd")) {
    signals.push({ label: "Honeypot", value: "signals.withdraw_lock" });
    riskPoints += 30;
  }
  if (bytecode.includes("363d3d373d3d3d363d73")) {
    signals.push({ label: "Proxy", value: "signals.proxy" });
    riskPoints += 15;
  }

  const score = Math.max(0, 100 - riskPoints);
  return {
    score,
    signals: signals.length > 0 ? signals : [{ label: "Status", value: "signals.clean" }]
  };
}