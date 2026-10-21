// Único lugar do projeto que fala com a API Spring Boot.
// Se o endereço da API mudar, você muda aqui e só aqui.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request(caminho, opcoes = {}) {
  let resposta
  try {
    resposta = await fetch(BASE + caminho, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
    })
  } catch {
    // fetch só "estoura" assim quando nem chegou na API (API desligada, CORS, sem rede).
    throw new Error('Não foi possível conectar à API. O backend está rodando?')
  }

  // 204 = "apaguei, não tenho nada para devolver": não existe JSON para ler.
  if (resposta.status === 204) return null

  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    // O TratadorDeExcecoes do Spring devolve { status, erro, campos }.
    // Transformamos isso em um Error comum, guardando os erros por campo (se houver).
    const erro = new Error(dados?.erro || 'Erro inesperado no servidor')
    erro.campos = dados?.campos || null
    throw erro
  }
  return dados
}

export const api = {
  get: (caminho) => request(caminho),
  post: (caminho, corpo) => request(caminho, { method: 'POST', body: JSON.stringify(corpo) }),
  put: (caminho, corpo) =>
    request(caminho, { method: 'PUT', body: corpo ? JSON.stringify(corpo) : undefined }),
  delete: (caminho) => request(caminho, { method: 'DELETE' }),
}
