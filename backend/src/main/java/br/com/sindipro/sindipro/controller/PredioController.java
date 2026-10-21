package br.com.sindipro.sindipro.controller;

import br.com.sindipro.sindipro.model.Predio;
import br.com.sindipro.sindipro.service.PredioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/predios")
public class PredioController {

    @Autowired
    private PredioService predioService;

    @GetMapping
    public List<Predio> listarTodos() {
        return predioService.listarTodos();
    }

    @GetMapping("/{id}")
    public Predio buscarPorId(@PathVariable Long id) {
        return predioService.buscarPorId(id);
    }

    // @Valid: manda o Spring checar as anotações do model (@NotBlank, @Pattern...) ANTES de entrar no método.
    // Se reprovar, o método nem executa e o TratadorDeExcecoes devolve 400.
    // @ResponseStatus(CREATED): devolve 201 em vez de 200, que é o código correto para "criado".
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Predio criar(@Valid @RequestBody Predio predio) {
        return predioService.criar(predio);
    }

    @PutMapping("/{id}")
    public Predio atualizar(@PathVariable Long id, @Valid @RequestBody Predio predio) {
        return predioService.atualizar(id, predio);
    }

    // 204 No Content: apagou e não há nada para devolver.
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        predioService.deletar(id);
    }
}
