import { useState } from 'react'
import Painel from './pages/Painel.jsx'
import Predios from './pages/Predios.jsx'
import Unidades from './pages/Unidades.jsx'
import Moradores from './pages/Moradores.jsx'
import Vagas from './pages/Vagas.jsx'
import Encomendas from './pages/Encomendas.jsx'

// Menu do sistema. "chave" é o identificador interno; "componente" é a tela que ela abre.
const MENU = [
  { chave: 'painel', rotulo: 'Painel', componente: Painel },
  { chave: 'predios', rotulo: 'Prédios', componente: Predios },
  { chave: 'unidades', rotulo: 'Unidades', componente: Unidades },
  { chave: 'moradores', rotulo: 'Moradores', componente: Moradores },
  { chave: 'vagas', rotulo: 'Vagas', componente: Vagas },
  { chave: 'encomendas', rotulo: 'Encomendas', componente: Encomendas },
]

export default function App() {
  // useState guarda "qual tela está aberta". Mudou o valor -> o React redesenha a página.
  const [aberta, setAberta] = useState('painel')

  // Procura no MENU o item da tela aberta e pega o componente dele.
  const Tela = MENU.find((item) => item.chave === aberta).componente

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold">SindiPro</h1>
          {/* flex-wrap: no celular o menu quebra em mais de uma linha em vez de estourar a tela */}
          <nav className="flex flex-wrap gap-2">
            {MENU.map((item) => (
              <button
                key={item.chave}
                onClick={() => setAberta(item.chave)}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  aberta === item.chave ? 'bg-sky-600' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                {item.rotulo}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Trocar de "aberta" troca o componente inteiro; cada tela busca seus próprios dados ao abrir. */}
        <Tela />
      </main>
    </div>
  )
}
