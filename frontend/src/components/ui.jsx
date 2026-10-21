// Peças visuais pequenas, reaproveitadas em todas as telas.

// Um campo de formulário: rótulo + input + mensagem de erro daquele campo (vinda do backend).
export function Campo({ rotulo, erro, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {rotulo}
      <div className="mt-1">{children}</div>
      {erro && <p className="mt-1 text-xs text-red-600">{erro}</p>}
    </label>
  )
}

// Classes do Tailwind repetidas em todo input/select: guardadas numa constante para não copiar 20 vezes.
export const estiloInput =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'

export function Botao({ children, variante = 'primario', ...props }) {
  const cores = {
    primario: 'bg-sky-600 text-white hover:bg-sky-700',
    perigo: 'bg-red-600 text-white hover:bg-red-700',
    neutro: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
  }
  return (
    <button
      className={`rounded-md px-3 py-2 text-sm font-medium transition ${cores[variante]} disabled:opacity-50`}
      {...props}
    >
      {children}
    </button>
  )
}

// Faixa de mensagem: vermelha para erro, verde para sucesso.
export function Aviso({ tipo = 'erro', children }) {
  if (!children) return null
  const cor =
    tipo === 'erro'
      ? 'border-red-300 bg-red-50 text-red-800'
      : 'border-green-300 bg-green-50 text-green-800'
  return <div className={`mb-4 rounded-md border px-4 py-3 text-sm ${cor}`}>{children}</div>
}

// Estado de carregamento: aparece enquanto a API ainda não respondeu.
export function Carregando() {
  return <p className="py-6 text-center text-sm text-slate-500">Carregando...</p>
}

export function SemRegistros({ children }) {
  return <p className="py-6 text-center text-sm text-slate-500">{children}</p>
}

export function Cartao({ titulo, children }) {
  return (
    <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {titulo && <h2 className="mb-4 text-lg font-semibold text-slate-800">{titulo}</h2>}
      {children}
    </section>
  )
}
