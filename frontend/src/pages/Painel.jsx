import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Aviso, Carregando, Cartao } from '../components/ui.jsx'

// Painel: visão geral do condomínio (último item do README: "Painel com visão geral").
export default function Painel() {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        // Cinco chamadas em paralelo; depois só contamos o tamanho de cada lista (.length).
        const [predios, unidades, moradores, vagas, pendentes] = await Promise.all([
          api.get('/predios'),
          api.get('/unidades'),
          api.get('/moradores'),
          api.get('/vagas'),
          api.get('/encomendas?pendentes=true'),
        ])
        setDados({
          predios: predios.length,
          unidades: unidades.length,
          moradores: moradores.length,
          vagas: vagas.length,
          vagasLivres: vagas.filter((v) => !v.unidade).length,
          pendentes: pendentes.length,
        })
      } catch (e) {
        setErro(e.message)
      }
    }
    carregar()
  }, [])

  if (erro) return <Aviso tipo="erro">{erro}</Aviso>
  if (!dados) return <Carregando />

  const itens = [
    { rotulo: 'Prédios', valor: dados.predios },
    { rotulo: 'Unidades', valor: dados.unidades },
    { rotulo: 'Moradores', valor: dados.moradores },
    { rotulo: 'Vagas de garagem', valor: dados.vagas, detalhe: `${dados.vagasLivres} livre(s)` },
    { rotulo: 'Encomendas na portaria', valor: dados.pendentes, destaque: dados.pendentes > 0 },
  ]

  return (
    <Cartao titulo="Visão geral do condomínio">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {itens.map((item) => (
          <div
            key={item.rotulo}
            className={`rounded-lg border p-4 ${item.destaque ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}
          >
            <p className="text-3xl font-bold text-slate-800">{item.valor}</p>
            <p className="text-sm text-slate-600">{item.rotulo}</p>
            {item.detalhe && <p className="text-xs text-slate-400">{item.detalhe}</p>}
          </div>
        ))}
      </div>
    </Cartao>
  )
}
