import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

console.log('⏳ Backend da Agência IA Diniz iniciando...');

// ROTA: Salvar análise (Agora vinculada ao usuário)
app.post('/api/analysis', async (req, res) => {
  try {
    const { address, score, signals, user_address } = req.body;

    // Só salva se tiver o endereço do usuário (evita lixo no banco)
    if (!user_address) {
      return res.status(400).json({ message: 'Endereço do usuário é obrigatório para salvar.' });
    }

    const { data, error } = await supabase
      .from('analyses')
      .insert([{ 
        address, 
        score, 
        signals: JSON.stringify(signals),
        user_address // Salva quem fez a análise
      }]);

    if (error) throw error;
    console.log(`✅ Análise de ${user_address} salva: ${address}`);
    res.status(201).json({ message: 'Salvo com sucesso!', data });
  } catch (error) {
    console.error('❌ Erro ao salvar:', error);
    res.status(500).json({ message: 'Erro interno', error });
  }
});

// ROTA: Buscar histórico (Filtrado por usuário)
app.get('/api/history', async (req, res) => {
  try {
    const { user } = req.query;

    if (!user) {
      return res.status(200).json([]); // Retorna vazio se não houver usuário conectado
    }

    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_address', user) // FILTRO: Só traz o que for do usuário logado
      .order('created_at', { ascending: false })
      .limit(10); // Aumentei para 10 para o histórico ficar mais robusto

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Erro ao buscar histórico:', error);
    res.status(500).json({ message: 'Erro ao buscar dados' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor voando na porta ${PORT} com Supabase!`);
});
