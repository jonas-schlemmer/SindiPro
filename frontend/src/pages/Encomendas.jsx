import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Aviso, Botao, Campo, Carregando, Cartao, SemRegistros, estiloInput } from '../components/ui.jsx'

const FORM_VAZIO = { descricao: '', remetente: '', moradorId: '' }

// O backend manda datas como "2026-10-06T14:30:00". Aqui viram "06/10/2026 14:30".
function formatarData(data) {
  return data ? new Date(data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—'
}

export default function Encomendas() {
  const [encomendas, setEncomendas] = useState([])
  const [moradores, setMoradores] = useState([])
  const [somentePendentes, setSomentePendentes] = useState(true)
  const [carregando, setCarregando] = useState(true)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erro, setErro] = useState('')
  const [campos, setCampos] = useState({})
  const [sucesso, setSucesso] = useState('')

  // Recebe o filtro como parâmetro para sempre usar o valor mais novo do checkbox.
  async function carregar(pendentes = somentePendentes) {
    setCarregando(true)
    try {
      const [listaEncomendas, listaMoradores] = await Promise.all([
        api.get(pendentes ? '/encomendas?pendentes=true' : '/encomendas'),
        api.get('/moradores'),
      ])
      setEncomendas(listaEncomendas)
      setMoradores(listaMoradores)
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  function mudar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function alternarFiltro(e) {
    setSomentePendentes(e.target.checked)
    carregar(e.target.checked)
  }

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    setCampos({})
    setSucesso('')
    // Não mandamos dataRecebimento: o backend coloca "agora" sozinho.
    const corpo = {
      descricao: form.descricao,
      remetente: form.remetente,
      morador: form.moradorId ? { id: Number(form.moradorId) } : null,
    }
    try {
      await api.post('/encomendas', corpo)
      setSucesso('Encomenda registrada!')
      setForm(FORM_VAZIO)
      carregar()
    } catch (e) {
      setErro(e.message)
      setCampos(e.campos || {})
    }
  }

  // "Marcar como retirada" chama PUT /encomendas/{id}/retirar (sem corpo).
  async function retirar(id) {
    setErro('')
    setSucesso('')
    try {
      await api.put(`/encomendas/${id}/retirar`)
      setSucesso('Encomenda marcada como retirada.')
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function excluir(id) {
    if (!window.confirm('Excluir este registro de encomenda?')) return
    setErro('')
    setSucesso('')
    try {
      await api.delete(`/encomendas/${id}`)
      setSucesso('Encomenda excluída.')
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <>
      <Aviso tipo="erro">{erro}</Aviso>
      <Aviso tipo="sucesso">{sucesso}</Aviso>

      <Cartao titulo="Registrar encomenda na portaria">
        <form onSubmit={salvar} className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Descrição" erro={campos.descricao}>
            <input name="descricao" value={form.descricao} onChange={mudar} placeholder="Caixa média" className={estiloInput} />
          </Campo>
          <Campo rotulo="Remetente (opcional)">
            <input name="remetente" value={form.remetente} onChange={mudar} className={estiloInput} />
          </Campo>
          <Campo rotulo="Morador" erro={campos.morador}>
            <select name="moradorId" value={form.moradorId} onChange={mudar} className={estiloInput}>
              <option value="">Selecione...</option>
              {moradores.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome} — bloco {m.unidade.bloco}, apto {m.unidade.numeroApartamento}
                </option>
              ))}
            </select>
          </Campo>
          <div className="flex items-end">
            <Botao type="submit">Registrar</Botao>
          </div>
        </form>
      </Cartao>

      <Cartao titulo="Encomendas">
        <label className="mb-4 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={somentePendentes} onChange={alternarFiltro} />
          Mostrar só as que ainda não foram retiradas
        </label>

        {carregando ? (
          <Carregando />
        ) : encomendas.length === 0 ? (
          <SemRegistros>Nenhuma encomenda por aqui.</SemRegistros>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="py-2">Descrição</th>
                  <th>Morador</th>
                  <th>Chegou em</th>
                  <th>Retirada</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {encomendas.map((enc) => (
                  <tr key={enc.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">
                      {enc.descricao}
                      {enc.remetente && <span className="block text-xs text-slate-400">de {enc.remetente}</span>}
                    </td>
                    <td>
                      {enc.morador.nome}
                      <span className="block text-xs text-slate-400">
                        bloco {enc.morador.unidade.bloco}, apto {enc.morador.unidade.numeroApartamento}
                      </span>
                    </td>
                    <td>{formatarData(enc.dataRecebimento)}</td>
                    <td>
                      {enc.dataRetirada ? formatarData(enc.dataRetirada) : (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">Na portaria</span>
                      )}
                    </td>
                    <td className="space-x-2 py-2 text-right">
                      {!enc.dataRetirada && <Botao onClick={() => retirar(enc.id)}>Marcar retirada</Botao>}
                      <Botao variante="perigo" onClick={() => excluir(enc.id)}>Excluir</Botao>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Cartao>
    </>
  )
}
