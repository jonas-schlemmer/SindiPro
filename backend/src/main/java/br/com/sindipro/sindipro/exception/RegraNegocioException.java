package br.com.sindipro.sindipro.exception;

// Lançada quando o pedido é bem formado, mas quebra uma regra do negócio
// (ex: CPF repetido, apagar prédio que tem unidades).
// O TratadorDeExcecoes transforma isso em HTTP 409 (conflito).
public class RegraNegocioException extends RuntimeException {

    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
