import { useEffect } from 'react'
import { Botao } from './ui.jsx'

// Janela de confirmação no estilo do sistema (substitui o window.confirm do navegador).
//   titulo, mensagem  = textos da janela
//   textoConfirmar    = texto do botão vermelho (padrão: "Excluir")
//   aoConfirmar       = roda quando clica no botão vermelho
//   aoCancelar        = roda ao clicar em Cancelar, fora da janela ou apertar ESC
export default function ModalConfirmar({
  titulo,
  mensagem,
  textoConfirmar = 'Excluir',
  aoConfirmar,
  aoCancelar,
}) {
  // Fecha a janela com a tecla ESC.
  useEffect(() => {
    function aoApertar(e) {
      if (e.key === 'Escape') aoCancelar()
    }
    window.addEventListener('keydown', aoApertar)
    return () => window.removeEventListener('keydown', aoApertar)
  }, [aoCancelar])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={aoCancelar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()} // clicar dentro da janela não fecha
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </div>

        <h3 id="modal-titulo" className="mt-4 text-lg font-semibold text-slate-800">
          {titulo}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{mensagem}</p>

        <div className="mt-6 flex justify-center gap-3">
          {/* autoFocus no Cancelar: apertar Enter sem querer não exclui nada */}
          <Botao variante="neutro" onClick={aoCancelar} autoFocus>
            Cancelar
          </Botao>
          <Botao variante="perigo" onClick={aoConfirmar}>
            {textoConfirmar}
          </Botao>
        </div>
      </div>
    </div>
  )
}