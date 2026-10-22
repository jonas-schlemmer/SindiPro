import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Aviso, Carregando, Cartao, CartaoNumero, Selo } from '../components/ui.jsx'

// Quantos dias uma encomenda pode ficar na portaria antes de virar alerta.
const DIAS_PARADA = 3

// Identifica uma unidade (usa o id; se não tiver, usa bloco + apartamento).
function chaveUnidade(u) {
  return u?.id ?? `${u?.bloco}-${u?.numeroApartamento}`
}

function plural(n, singular, pluralTexto) {
  return n === 1 ? singular : pluralTexto
}

function saudacao(data) {
  const hora = data.getHours()
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

// Grade de cards que centraliza a última linha (ex.: 3 em cima, 2 centralizados embaixo).
// No celular: 1 por linha. Tela média: 2 por linha. Tela grande: 3 por linha.
function GradeCentralizada({ children }) {
  return <div className="flex flex-wrap justify-center gap-4">{children}</div>
}

function ItemGrade({ children }) {
  return (
    <div className="grid w-full sm:w-[calc((100%_-_1rem)/2)] lg:w-[calc((100%_-_2rem)/3)]">
      {children}
    </div>
  )
}

// Topo do Painel: saudação grande à esquerda, data e hora à direita.
// Tem o próprio relógio (atualiza sozinho a cada segundo) para não redesenhar o Painel inteiro.
function Cabecalho() {
  const [agora, setAgora] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), 1000)
    return () => clearInterval(id) // para o relógio quando sair da tela
  }, [])

  const texto = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  const data = texto.charAt(0).toUpperCase() + texto.slice(1)
  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          {saudacao(agora)}!
        </h2>
        <p className="mt-1 text-sm text-slate-500">Veja como está o condomínio hoje.</p>
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold leading-none tabular-nums text-slate-800">{hora}</p>
        <p className="mt-1 text-sm text-slate-500">{data}</p>
      </div>
    </div>
  )
}

// Barrinha de progresso que vai dentro do card de ocupação.
// tipo "vagas": vermelha quando cheia. tipo "unidades": amarela quando menos da metade tem morador.
function BarraOcupacao({ usado, total, tipo }) {
  const pct = total > 0 ? Math.round((usado / total) * 100) : 0
  let cor = 'bg-emerald-500'
  if (tipo === 'vagas') {
    if (pct >= 100) cor = 'bg-red-500'
    else if (pct >= 80) cor = 'bg-amber-500'
  } else if (pct < 50) {
    cor = 'bg-amber-500'
  }
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all ${cor}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500">{pct}%</span>
    </div>
  )
}

// Painel: visão geral do condomínio. "irPara" vem do App e troca a tela aberta.
export default function Painel({ irPara }) {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        // Cinco chamadas em paralelo.
        const [predios, unidades, moradores, vagas, pendentes] = await Promise.all([
          api.get('/predios'),
          api.get('/unidades'),
          api.get('/moradores'),
          api.get('/vagas'),
          api.get('/encomendas?pendentes=true'),
        ])

        const vagasLivres = vagas.filter((v) => !v.unidade).length

        // Encomendas paradas há mais de DIAS_PARADA dias.
        const limite = DIAS_PARADA * 24 * 60 * 60 * 1000
        const paradas = pendentes.filter(
          (e) => e.dataRecebimento && Date.now() - new Date(e.dataRecebimento).getTime() > limite,
        ).length

        // Unidades que têm pelo menos um morador.
        const ocupadas = new Set(moradores.map((m) => chaveUnidade(m.unidade)))
        const unidadesComMorador = unidades.filter((u) => ocupadas.has(chaveUnidade(u))).length

        // Resumo por bloco: quantas unidades e moradores em cada um.
        const blocos = {}
        const garantir = (b) => (blocos[b] = blocos[b] || { unidades: 0, moradores: 0 })
        unidades.forEach((u) => garantir(u.bloco ?? '—').unidades++)
        moradores.forEach((m) => garantir(m.unidade?.bloco ?? '—').moradores++)
        const resumoBlocos = Object.entries(blocos)
          .map(([bloco, v]) => ({ bloco, ...v }))
          .sort((a, b) => String(a.bloco).localeCompare(String(b.bloco), 'pt-BR', { numeric: true }))

        setDados({
          predios: predios.length,
          unidades: unidades.length,
          moradores: moradores.length,
          vagas: vagas.length,
          vagasLivres,
          pendentes: pendentes.length,
          paradas,
          unidadesComMorador,
          resumoBlocos,
          // Os 3 moradores mais novos (id maior = cadastrado depois).
          recentes: [...moradores].sort((a, b) => b.id - a.id).slice(0, 3),
        })
      } catch (e) {
        setErro(e.message)
      }
    }
    carregar()
  }, [])

  if (erro) return <Aviso tipo="erro">{erro}</Aviso>
  if (!dados) return <Carregando />

  // Selo das vagas: vermelho "Lotado" quando não sobra nenhuma, verde quando sobra.
  const seloVagas =
    dados.vagasLivres === 0 ? (
      <Selo cor="vermelho">Lotado</Selo>
    ) : (
      <Selo cor="verde">
        {dados.vagasLivres} {plural(dados.vagasLivres, 'livre', 'livres')}
      </Selo>
    )

  // "para" é a chave do menu do App.jsx (a tela que o card abre ao clicar).
  const itens = [
    { icone: 'predio', cor: 'azul', rotulo: 'Prédios', valor: dados.predios, para: 'predios' },
    { icone: 'porta', cor: 'verde', rotulo: 'Unidades', valor: dados.unidades, para: 'unidades' },
    { icone: 'pessoas', cor: 'roxo', rotulo: 'Moradores', valor: dados.moradores, para: 'moradores' },
    {
      icone: 'carro',
      cor: 'laranja',
      rotulo: 'Vagas de garagem',
      valor: dados.vagas,
      detalhe: seloVagas,
      para: 'vagas',
    },
    {
      icone: 'caixa',
      cor: 'amarelo',
      rotulo: 'Encomendas na portaria',
      valor: dados.pendentes,
      destaque: dados.pendentes > 0,
      para: 'encomendas',
    },
  ]

  // Cards de ocupação (mesmo estilo dos cards da visão geral).
  const vagasOcupadas = dados.vagas - dados.vagasLivres
  const ocupacao = [
    {
      icone: 'carro',
      cor: 'laranja',
      rotulo: 'Vagas ocupadas',
      valor: `${vagasOcupadas}/${dados.vagas}`,
      detalhe: <BarraOcupacao usado={vagasOcupadas} total={dados.vagas} tipo="vagas" />,
      para: 'vagas',
    },
    {
      icone: 'porta',
      cor: 'verde',
      rotulo: 'Unidades com morador',
      valor: `${dados.unidadesComMorador}/${dados.unidades}`,
      detalhe: <BarraOcupacao usado={dados.unidadesComMorador} total={dados.unidades} tipo="unidades" />,
      para: 'unidades',
    },
  ]

  // Alertas: só entram na lista se houver algo a avisar.
  const unidadesSemMorador = dados.unidades - dados.unidadesComMorador
  const alertas = []
  if (dados.paradas > 0) {
    alertas.push({
      cor: 'border-red-300 bg-red-50 text-red-800',
      texto: `${dados.paradas} ${plural(dados.paradas, 'encomenda parada', 'encomendas paradas')} há mais de ${DIAS_PARADA} dias na portaria`,
      para: 'encomendas',
    })
  }
  if (unidadesSemMorador > 0) {
    alertas.push({
      cor: 'border-amber-300 bg-amber-50 text-amber-800',
      texto: `${unidadesSemMorador} ${plural(unidadesSemMorador, 'unidade sem morador', 'unidades sem morador')}`,
      para: 'unidades',
    })
  }

  return (
    <>
      <Cabecalho />

      {/* Alertas (ocupam a largura toda, acima das colunas) */}
      {alertas.length > 0 && (
        <div className="mb-6 space-y-2">
          {alertas.map((a) => (
            <button
              key={a.texto}
              onClick={() => irPara(a.para)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition hover:shadow-md ${a.cor}`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
              <span className="flex-1 font-medium">{a.texto}</span>
              <span className="text-xs font-semibold">Ver →</span>
            </button>
          ))}
        </div>
      )}

      {/* Duas colunas: esquerda (2/3) com os cards, direita (1/3) com as listas.
          Em telas menores, tudo empilha em uma coluna só. */}
      <div className="grid gap-x-6 lg:grid-cols-3">
        {/* COLUNA ESQUERDA */}
        <div className="min-w-0 lg:col-span-2">
          <Cartao titulo="Visão geral do condomínio">
            <GradeCentralizada>
              {itens.map((item) => (
                <ItemGrade key={item.rotulo}>
                  <CartaoNumero
                    icone={item.icone}
                    cor={item.cor}
                    numero={item.valor}
                    rotulo={item.rotulo}
                    detalhe={item.detalhe}
                    destaque={item.destaque}
                    onClick={() => irPara(item.para)}
                  />
                </ItemGrade>
              ))}
            </GradeCentralizada>
          </Cartao>

          {/* Ocupação: 2 cards lado a lado, cada um com metade da largura (cabe a barra inteira) */}
          <Cartao titulo="Ocupação">
            <div className="grid gap-4 sm:grid-cols-2">
              {ocupacao.map((item) => (
                <CartaoNumero
                  key={item.rotulo}
                  icone={item.icone}
                  cor={item.cor}
                  numero={item.valor}
                  rotulo={item.rotulo}
                  detalhe={item.detalhe}
                  onClick={() => irPara(item.para)}
                />
              ))}
            </div>
          </Cartao>
        </div>

        {/* COLUNA DIREITA */}
        <div className="min-w-0">
          <Cartao titulo="Resumo por bloco">
            {dados.resumoBlocos.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma unidade cadastrada ainda.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {dados.resumoBlocos.map((b) => (
                  <li key={b.bloco} className="flex items-center justify-between gap-2 py-3">
                    <span className="font-medium text-slate-800">Bloco {b.bloco}</span>
                    <span className="text-right text-sm text-slate-500">
                      {b.unidades} {plural(b.unidades, 'unidade', 'unidades')} · {b.moradores}{' '}
                      {plural(b.moradores, 'morador', 'moradores')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Cartao>

          <Cartao titulo="Moradores mais recentes">
            {dados.recentes.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhum morador cadastrado ainda.</p>
            ) : (
              <>
                <ul className="divide-y divide-slate-100">
                  {dados.recentes.map((m) => (
                    <li key={m.id} className="flex items-center gap-3 py-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
                        {m.nome?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">{m.nome}</p>
                        {m.unidade && (
                          <p className="text-xs text-slate-500">
                            bloco {m.unidade.bloco}, apto {m.unidade.numeroApartamento}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-right">
                  <button
                    onClick={() => irPara('moradores')}
                    className="text-sm font-medium text-sky-600 transition hover:text-sky-700 hover:underline"
                  >
                    Ver todos →
                  </button>
                </div>
              </>
            )}
          </Cartao>
        </div>
      </div>
    </>
  )
}