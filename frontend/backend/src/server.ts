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

// ROTA: Salvar análise
app.post('/api/analysis', async (req, res) => {
  try {
    const { address, score, signals } = req.body;
    const { data, error } = await supabase
      .from('analyses')
      .insert([{ 
        address, 
        score, 
        signals: JSON.stringify(signals) 
      }]);

    if (error) throw error;
    console.log(`✅ Análise salva: ${address}`);
    res.status(201).json({ message: 'Salvo no Supabase!', data });
  } catch (error) {
    console.error('❌ Erro ao salvar:', error);
    res.status(500).json({ message: 'Erro interno', error });
  }
});

// ROTA: Buscar histórico (Últimas 5)
app.get('/api/history', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

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