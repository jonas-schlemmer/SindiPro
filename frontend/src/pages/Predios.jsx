import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Aviso, Botao, Campo, Carregando, Cartao, SemRegistros, estiloInput } from '../components/ui.jsx'

// Formulário "vazio". Usamos para limpar a tela depois de salvar.
const FORM_VAZIO = { rua: '', bairro: '', cidade: '', cep: '', nomeCondominio: '', numeroCondominio: '' }

export default function Predios() {
  const [predios, setPredios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [form, setForm] = useState(FORM_VAZIO)
  const [editandoId, setEditandoId] = useState(null) // null = criando; número = editando aquele id
  const [erro, setErro] = useState('')
  const [campos, setCampos] = useState({}) // erros por campo, vindos do backend (@Valid)
  const [sucesso, setSucesso] = useState('')

  async function carregar() {
    setCarregando(true)
    try {
      setPredios(await api.get('/predios'))
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  // useEffect com [] no final = "rode UMA vez, quando a tela abrir".
  useEffect(() => {
    carregar()
  }, [])

  // Um único handler para todos os inputs: o "name" do input é a chave dentro de "form".
  function mudar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function salvar(e) {
    e.preventDefault() // impede o navegador de recarregar a página ao enviar o formulário
    setErro('')
    setCampos({})
    setSucesso('')
    // Input sempre devolve texto; o backend espera número em numeroCondominio.
    const corpo = { ...form, numeroCondominio: Number(form.numeroCondominio) }
    try {
      if (editandoId) {
        await api.put(`/predios/${editandoId}`, corpo)
      } else {
        await api.post('/predios', corpo)
      }
      setSucesso(editandoId ? 'Prédio atualizado!' : 'Prédio cadastrado!')
      cancelar()
      carregar()
    } catch (e) {
      setErro(e.message)
      setCampos(e.campos || {})
    }
  }

  function editar(predio) {
    setEditandoId(predio.id)
    setForm({
      rua: predio.rua,
      bairro: predio.bairro,
      cidade: predio.cidade,
      cep: predio.cep,
      nomeCondominio: predio.nomeCondominio,
      numeroCondominio: predio.numeroCondominio,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelar() {
    setEditandoId(null)
    setForm(FORM_VAZIO)
  }

  async function excluir(id) {
    if (!window.confirm('Excluir este prédio?')) return
    setErro('')
    setSucesso('')
    try {
      await api.delete(`/predios/${id}`)
      setSucesso('Prédio excluído.')
      carregar()
    } catch (e) {
      // Aqui aparece a regra do backend: "o prédio ainda possui unidades cadastradas".
      setErro(e.message)
    }
  }

  return (
    <>
      <Aviso tipo="erro">{erro}</Aviso>
      <Aviso tipo="sucesso">{sucesso}</Aviso>

      <Cartao titulo={editandoId ? 'Editar prédio' : 'Novo prédio'}>
        <form onSubmit={salvar} className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Nome do condomínio" erro={campos.nomeCondominio}>
            <input name="nomeCondominio" value={form.nomeCondominio} onChange={mudar} className={estiloInput} />
          </Campo>
          <Campo rotulo="Número do condomínio" erro={campos.numeroCondominio}>
            <input name="numeroCondominio" type="number" value={form.numeroCondominio} onChange={mudar} className={estiloInput} />
          </Campo>
          <Campo rotulo="Rua" erro={campos.rua}>
            <input name="rua" value={form.rua} onChange={mudar} className={estiloInput} />
          </Campo>
          <Campo rotulo="Bairro" erro={campos.bairro}>
            <input name="bairro" value={form.bairro} onChange={mudar} className={estiloInput} />
          </Campo>
          <Campo rotulo="Cidade" erro={campos.cidade}>
            <input name="cidade" value={form.cidade} onChange={mudar} className={estiloInput} />
          </Campo>
          <Campo rotulo="CEP" erro={campos.cep}>
            <input name="cep" value={form.cep} onChange={mudar} placeholder="12345-678" className={estiloInput} />
          </Campo>
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

      <Cartao titulo="Prédios cadastrados">
        {carregando ? (
          <Carregando />
        ) : predios.length === 0 ? (
          <SemRegistros>Nenhum prédio cadastrado ainda.</SemRegistros>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="py-2">Condomínio</th>
                  <th>Endereço</th>
                  <th>CEP</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {predios.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">
                      {p.nomeCondominio} <span className="text-slate-400">nº {p.numeroCondominio}</span>
                    </td>
                    <td>
                      {p.rua}, {p.bairro} — {p.cidade}
                    </td>
                    <td>{p.cep}</td>
                    <td className="space-x-2 py-2 text-right">
                      <Botao variante="neutro" onClick={() => editar(p)}>Editar</Botao>
                      <Botao variante="perigo" onClick={() => excluir(p.id)}>Excluir</Botao>
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
