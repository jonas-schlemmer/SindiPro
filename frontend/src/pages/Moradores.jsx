import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Aviso, Botao, Campo, Carregando, Cartao, SemRegistros, estiloInput } from '../components/ui.jsx'

const FORM_VAZIO = { nome: '', cpf: '', idade: '', tipo: 'PROPRIETARIO', valorAluguel: '', unidadeId: '' }

export default function Moradores() {
  const [moradores, setMoradores] = useState([])
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
      const [listaMoradores, listaUnidades] = await Promise.all([api.get('/moradores'), api.get('/unidades')])
      setMoradores(listaMoradores)
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

  function mudar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    setCampos({})
    setSucesso('')
    const corpo = {
      nome: form.nome,
      cpf: form.cpf,
      idade: Number(form.idade),
      tipo: form.tipo,
      // Só inquilino tem aluguel. Para proprietário mandamos null (o backend também garante isso).
      valorAluguel: form.tipo === 'INQUILINO' && form.valorAluguel !== '' ? Number(form.valorAluguel) : null,
      unidade: form.unidadeId ? { id: Number(form.unidadeId) } : null,
    }
    try {
      if (editandoId) {
        await api.put(`/moradores/${editandoId}`, corpo)
      } else {
        await api.post('/moradores', corpo)
      }
      setSucesso(editandoId ? 'Morador atualizado!' : 'Morador cadastrado!')
      cancelar()
      carregar()
    } catch (e) {
      // Aqui aparece, por exemplo: "Já existe um morador cadastrado com o CPF 111.222.333-44"
      setErro(e.message)
      setCampos(e.campos || {})
    }
  }

  function editar(m) {
    setEditandoId(m.id)
    setForm({
      nome: m.nome,
      cpf: m.cpf,
      idade: m.idade,
      tipo: m.tipo,
      valorAluguel: m.valorAluguel ?? '', // ?? troca null por '' (input não aceita null)
      unidadeId: m.unidade.id,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelar() {
    setEditandoId(null)
    setForm(FORM_VAZIO)
  }

  async function excluir(id) {
    if (!window.confirm('Excluir este morador?')) return
    setErro('')
    setSucesso('')
    try {
      await api.delete(`/moradores/${id}`)
      setSucesso('Morador excluído.')
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <>
      <Aviso tipo="erro">{erro}</Aviso>
      <Aviso tipo="sucesso">{sucesso}</Aviso>

      <Cartao titulo={editandoId ? 'Editar morador' : 'Novo morador'}>
        <form onSubmit={salvar} className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Nome" erro={campos.nome}>
            <input name="nome" value={form.nome} onChange={mudar} className={estiloInput} />
          </Campo>
          <Campo rotulo="CPF" erro={campos.cpf}>
            <input name="cpf" value={form.cpf} onChange={mudar} placeholder="000.000.000-00" className={estiloInput} />
          </Campo>
          <Campo rotulo="Idade" erro={campos.idade}>
            <input name="idade" type="number" value={form.idade} onChange={mudar} className={estiloInput} />
          </Campo>
          <Campo rotulo="Unidade" erro={campos.unidade}>
            <select name="unidadeId" value={form.unidadeId} onChange={mudar} className={estiloInput}>
              <option value="">Selecione...</option>
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.predio.nomeCondominio} — bloco {u.bloco}, apto {u.numeroApartamento}
                </option>
              ))}
            </select>
          </Campo>
          <Campo rotulo="Tipo" erro={campos.tipo}>
            <select name="tipo" value={form.tipo} onChange={mudar} className={estiloInput}>
              <option value="PROPRIETARIO">Proprietário</option>
              <option value="INQUILINO">Inquilino</option>
            </select>
          </Campo>
          {/* Renderização condicional: o campo só existe na tela se o tipo for INQUILINO. */}
          {form.tipo === 'INQUILINO' && (
            <Campo rotulo="Valor do aluguel (R$)" erro={campos.valorAluguel}>
              <input name="valorAluguel" type="number" step="0.01" value={form.valorAluguel} onChange={mudar} className={estiloInput} />
            </Campo>
          )}
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

      <Cartao titulo="Moradores cadastrados">
        {carregando ? (
          <Carregando />
        ) : moradores.length === 0 ? (
          <SemRegistros>Nenhum morador cadastrado ainda.</SemRegistros>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="py-2">Nome</th>
                  <th>CPF</th>
                  <th>Tipo</th>
                  <th>Unidade</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {moradores.map((m) => (
                  <tr key={m.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">{m.nome}</td>
                    <td>{m.cpf}</td>
                    <td>
                      {m.tipo === 'INQUILINO'
                        ? `Inquilino (R$ ${Number(m.valorAluguel).toFixed(2)})`
                        : 'Proprietário'}
                    </td>
                    <td>
                      Bloco {m.unidade.bloco}, apto {m.unidade.numeroApartamento}
                    </td>
                    <td className="space-x-2 py-2 text-right">
                      <Botao variante="neutro" onClick={() => editar(m)}>Editar</Botao>
                      <Botao variante="perigo" onClick={() => excluir(m.id)}>Excluir</Botao>
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
