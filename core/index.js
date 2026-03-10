const path = require('path');
// O '..' avisa ao código para subir uma pasta e procurar o .env na raiz
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Verificação de segurança
if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Erro: O código não achou as chaves no .env.");
    console.log("Verifique se o arquivo .env está na raiz e tem os nomes certos.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function salvarLeadTeste() {
  console.log("🚀 Agência IA Diniz: Conectando ao banco...");

  const { data, error } = await supabase
    .from('leads_clinicas')
    .insert([
      { 
        nome_paciente: "Paciente VIP Teste", 
        whatsapp: "5511999999999", 
        procedimento_interesse: "Botox - Teste Raiz",
        clinica_origem: "Agencia Diniz System"
      }
    ])
    .select();

  if (error) {
    console.error('❌ Erro no Supabase:', error.message);
  } else {
    console.log('✅ SUCESSO ABSOLUTO! O lead foi gravado partindo da raiz.');
    console.log('Dados gravados:', data);
  }
}

salvarLeadTeste();