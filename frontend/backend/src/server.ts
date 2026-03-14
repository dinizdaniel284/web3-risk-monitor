import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Ajustado para ler as variáveis da Vercel (Next.js style)
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

console.log('⏳ Backend da Agência IA Diniz iniciando...');

app.post('/api/analysis', async (req, res) => {
  try {
    const { address, score, signals, user_address } = req.body;

    if (!user_address) {
      return res.status(400).json({ message: 'user_address é obrigatório' });
    }

    const { data, error } = await supabase
      .from('analyses')
      .insert([{ 
        address, 
        score, 
        signals: JSON.stringify(signals),
        user_address 
      }]);

    if (error) throw error;
    res.status(201).json({ message: 'Salvo!', data });
  } catch (error) {
    console.error('❌ Erro ao salvar:', error);
    res.status(500).json({ message: 'Erro interno' });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.json([]);

    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_address', user)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Erro ao buscar:', error);
    res.status(500).json({ message: 'Erro ao buscar' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor voando na porta ${PORT}!`);
});
        
