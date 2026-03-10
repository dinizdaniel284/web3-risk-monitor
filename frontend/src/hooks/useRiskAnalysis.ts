// src/hooks/useRiskAnalysis.ts
import { useState } from 'react';
import { publicClient } from '../lib/viem';

export const useRiskAnalysis = () => {
  const [riskScore, setRiskScore] = useState<number>(100);
  const [signals, setSignals] = useState<string[]>([]);

  // Tornamos a função assíncrona para suportar as chamadas à blockchain
  const analyzeContract = async (address: string) => {
    let score = 100;
    let newSignals: string[] = [];

    try {
      // 1. Verificação Real: O endereço possui código (Bytecode)?
      const bytecode = await publicClient.getBytecode({ 
        address: address as `0x${string}` 
      });

      const isContract = bytecode !== undefined && bytecode !== '0x';

      if (!isContract) {
        // Se for uma carteira comum (EOA), o risco é diferente de um contrato
        score = 15;
        newSignals.push("signal_not_contract"); // Adicione esta chave no seu i18n
      } else {
        // 2. Simulação de lógica avançada (Proxy/Owner) 
        // Em um estágio futuro, buscaremos isso via ABI
        score -= 30;
        newSignals.push("signal_owner"); 

        score -= 20;
        newSignals.push("signal_proxy");
      }

      setRiskScore(score);
      setSignals(newSignals);
      
    } catch (error) {
      console.error("Erro na análise técnica:", error);
      // Fallback em caso de erro de conexão
      setRiskScore(0);
      setSignals(["error_blockchain_connection"]);
    }
  };

  return { riskScore, signals, analyzeContract };
};