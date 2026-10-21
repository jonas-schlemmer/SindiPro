import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Aviso, Botao, Campo, Carregando, Cartao, SemRegistros, estiloInput } from '../components/ui.jsx'

const FORM_VAZIO = { numero: '', coberta: false, unidadeId: '' }

export default function Vagas() {
  const [vagas, setVagas] = useState([])
  const [unidades, setUnidades] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [form, setForm] = useState(FORM_VAZIO)
  const [editandoId, setEditandoId] = useState(null)
  const [erro, setErro] = useState('')
  const [campos, setCampos] = useState({})
  const [sucesso, setSucesso] = useState('')

  async function carregar() {
    setCarregando(true)
    try {
      const [listaVagas, listaUnidades] = await Promise.all([api.get('/vagas'), api.get('/unidades')])
      setVagas(listaVagas)
      setUnidades(listaUnidades)
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  // Checkbox é diferente dos outros inputs: o valor está em "checked", não em "value".
  function mudar(e) {
    const { name, type, checked, value } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    setCampos({})
    setSucesso('')
    const corpo = {
      numero: form.numero,
      coberta: form.coberta,
      // RELAÇÃO OPCIONAL: sem unidade escolhida mandamos null = vaga livre.
      unidade: form.unidadeId ? { id: Number(form.unidadeId) } : null,
    }
    try {
      if (editandoId) {
        await api.put(`/vagas/${editandoId}`, corpo)
      } else {
        await api.post('/vagas', corpo)
      }
      setSucesso(editandoId ? 'Vaga atualizada!' : 'Vaga cadastrada!')
      cancelar()
      carregar()
    } catch (e) {
      setErro(e.message)
      setCampos(e.campos || {})
    }
  }

  function editar(v) {
    setEditandoId(v.id)
    setForm({ numero: v.numero, coberta: !!v.coberta, unidadeId: v.unidade ? v.unidade.id : '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelar() {
    setEditandoId(null)
    setForm(FORM_VAZIO)
  }

  async function excluir(id) {
    if (!window.confirm('Excluir esta vaga?')) return
    setErro('')
    setSucesso('')
    try {
      await api.delete(`/vagas/${id}`)
      setSucesso('Vaga excluída.')
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <>
      <Aviso tipo="erro">{erro}</Aviso>
      <Aviso tipo="sucesso">{sucesso}</Aviso>

      <Cartao titulo={editandoId ? 'Editar vaga' : 'Nova vaga de garagem'}>
        <form onSubmit={salvar} className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Número da vaga" erro={campos.numero}>
            <input name="numero" value={form.numero} onChange={mudar} className={estiloInput} />
          </Campo>
          <Campo rotulo="Unidade (opcional)" erro={campos.unidade}>
            <select name="unidadeId" value={form.unidadeId} onChange={mudar} className={estiloInput}>
              <option value="">Livre (sem unidade)</option>
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.predio.nomeCondominio} — bloco {u.bloco}, apto {u.numeroApartamento}
                </option>
              ))}
            </select>
          </Campo>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input name="coberta" type="checkbox" checked={form.coberta} onChange={mudar} />
            Vaga coberta
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <Botao type="submit">{editandoId ? 'Salvar alterações' : 'Cadastrar'}</Botao>
            {editandoId && (
              <Botao type="button" variante="neutro" onClick={cancelar}>
                Cancelar
              </Botao>
            )}
          </div>
        </form>
      </Cartao>

      <Cartao titulo="Vagas cadastradas">
        {carregando ? (
          <Carregando />
        ) : vagas.length === 0 ? (
          <SemRegistros>Nenhuma vaga cadastrada ainda.</SemRegistros>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="py-2">Vaga</th>
                  <th>Tipo</th>
                  <th>Unidade</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {vagas.map((v) => (
                  <tr key={v.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">{v.numero}</td>
                    <td>{v.coberta ? 'Coberta' : 'Descoberta'}</td>
                    <td>
                      {v.unidade ? `Bloco ${v.unidade.bloco}, apto ${v.unidade.numeroApartamento}` : (
                        <span className="text-slate-400">Livre</span>
                      )}
                    </td>
                    <td className="space-x-2 py-2 text-right">
                      <Botao variante="neutro" onClick={() => editar(v)}>Editar</Botao>
                      <Botao variante="perigo" onClick={() => excluir(v.id)}>Excluir</Botao>
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
