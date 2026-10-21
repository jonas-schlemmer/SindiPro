package br.com.sindipro.sindipro.controller;

import br.com.sindipro.sindipro.model.Unidade;
import br.com.sindipro.sindipro.service.UnidadeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/unidades")
public class UnidadeController {

    @Autowired
    private UnidadeService unidadeService;

    @GetMapping
    public List<Unidade> listarTodos() {
        return unidadeService.listarTodos();
    }

    @GetMapping("/{id}")
    public Unidade buscarPorId(@PathVariable Long id) {
        return unidadeService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Unidade criar(@Valid @RequestBody Unidade unidade) {
        return unidadeService.criar(unidade);
    }

    @PutMapping("/{id}")
    public Unidade atualizar(@PathVariable Long id, @Valid @RequestBody Unidade unidade) {
        return unidadeService.atualizar(id, unidade);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        unidadeService.deletar(id);
    }
}
