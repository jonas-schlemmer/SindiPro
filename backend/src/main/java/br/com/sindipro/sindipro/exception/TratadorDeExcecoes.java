package br.com.sindipro.sindipro.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

// @RestControllerAdvice = "central de erros". Qualquer exceção lançada em QUALQUER controller
// cai aqui, e a gente devolve um JSON organizado em vez daquele erro 500 gigante.
// Assim o React sempre sabe o formato do erro e consegue mostrar a mensagem na tela.
@RestControllerAdvice
public class TratadorDeExcecoes {

    // 404: id não existe
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> tratarNaoEncontrado(RecursoNaoEncontradoException ex) {
        return resposta(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    // 409: regra de negócio quebrada
    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<Map<String, Object>> tratarRegraNegocio(RegraNegocioException ex) {
        return resposta(HttpStatus.CONFLICT, ex.getMessage(), null);
    }

    // 400: o @Valid reprovou o corpo da requisição (campo vazio, CEP inválido...)
    // Devolvemos um mapa campo -> mensagem, ex: {"rua": "A rua é obrigatória"}
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> tratarValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(erro -> campos.put(erro.getField(), erro.getDefaultMessage()));
        return resposta(HttpStatus.BAD_REQUEST, "Dados inválidos", campos);
    }

    // 400: JSON quebrado ou com tipo errado (ex: "idade": "abc")
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> tratarJsonInvalido(HttpMessageNotReadableException ex) {
        return resposta(HttpStatus.BAD_REQUEST, "JSON inválido ou com tipo de dado errado", null);
    }

    private ResponseEntity<Map<String, Object>> resposta(HttpStatus status, String mensagem, Map<String, String> campos) {
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("status", status.value());
        corpo.put("erro", mensagem);
        if (campos != null) {
            corpo.put("campos", campos);
        }
        return ResponseEntity.status(status).body(corpo);
    }
}
