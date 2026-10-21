package br.com.sindipro.sindipro.exception;

// Lançada quando você pede um id que não existe (ex: GET /predios/999).
// O TratadorDeExcecoes transforma isso em HTTP 404 com uma mensagem amigável.
public class RecursoNaoEncontradoException extends RuntimeException {

    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}
