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
          <div className="flex items-center gap-2">
            <svg className="h-8 w-8" viewBox="0 0 512 512" aria-hidden="true">
              <rect width="512" height="512" rx="112" fill="#0284c7" />
              <rect x="144" y="112" width="224" height="288" rx="32" fill="#ffffff" />
              <g fill="#0284c7">
                <rect x="192" y="160" width="48" height="48" rx="10" />
                <rect x="272" y="160" width="48" height="48" rx="10" />
                <rect x="192" y="240" width="48" height="48" rx="10" />
                <rect x="272" y="240" width="48" height="48" rx="10" />
                <rect x="232" y="320" width="48" height="80" rx="10" />
              </g>
            </svg>
            <h1 className="text-xl font-bold">SindiPro</h1>
          </div>
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
        {/* irPara deixa a tela abrir outra tela (usado pelos cards do Painel). */}
        <Tela irPara={setAberta} />
      </main>
    </div>
  )
}