import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

// 🔒 Validação de ENV
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseKey =
  process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase ENV não configurado!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🚀 Backend Web3 Risk Monitor iniciado')

// 🔹 Helper de resposta padrão
const sendResponse = (res: any, status: number, data: any, message = '') => {
  return res.status(status).json({
    success: status < 400,
    message,
    data,
  })
}

// 🔹 Validação simples (já sobe nível)
const validateAnalysis = (body: any) => {
  const { address, score, signals, user_address } = body

  if (!address || typeof address !== 'string') {
    return 'Endereço inválido'
  }

  if (typeof score !== 'number') {
    return 'Score inválido'
  }

  if (!Array.isArray(signals)) {
    return 'Signals deve ser um array'
  }

  if (!user_address) {
    return 'user_address obrigatório'
  }

  return null
}

// 🔥 SALVAR ANÁLISE
app.post('/api/analysis', async (req, res) => {
  try {
    const errorValidation = validateAnalysis(req.body)
    if (errorValidation) {
      return sendResponse(res, 400, null, errorValidation)
    }

    const { address, score, signals, user_address } = req.body

    const { data, error } = await supabase
      .from('analyses')
      .insert([
        {
          address,
          score,
          signals, // agora direto array (melhor)
          user_address,
        },
      ])
      .select()

    if (error) throw error

    return sendResponse(res, 201, data, 'Análise salva com sucesso')
  } catch (err) {
    console.error('❌ Erro ao salvar:', err)
    return sendResponse(res, 500, null, 'Erro interno')
  }
})

// 🔥 HISTÓRICO
app.get('/api/history', async (req, res) => {
  try {
    const { user } = req.query

    if (!user) {
      return sendResponse(res, 200, [], 'Sem usuário')
    }

    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_address', user)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    return sendResponse(res, 200, data)
  } catch (err) {
    console.error('❌ Erro ao buscar:', err)
    return sendResponse(res, 500, null, 'Erro ao buscar histórico')
  }
})

// 🔥 HEALTH CHECK (isso aqui é MUITO profissional)
app.get('/api/health', (_, res) => {
  return sendResponse(res, 200, {
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`)
})
