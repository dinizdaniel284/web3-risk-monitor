export async function saveAnalysis(data: any) {
  try {
    await fetch('http://localhost:5000/api/analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  } catch (err) {
    console.log('Erro ao salvar análise', err)
  }
}
