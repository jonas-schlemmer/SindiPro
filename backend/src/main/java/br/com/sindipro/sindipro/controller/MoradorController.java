package br.com.sindipro.sindipro.controller;

import br.com.sindipro.sindipro.model.Morador;
import br.com.sindipro.sindipro.service.MoradorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/moradores")
public class MoradorController {

    @Autowired
    private MoradorService moradorService;

    // @RequestParam: parâmetro opcional na URL.
    //   GET /moradores                -> todos
    //   GET /moradores?unidadeId=3    -> só os da unidade 3
    // required = false: sem o parâmetro, o valor chega como null e listamos tudo.
    @GetMapping
    public List<Morador> listar(@RequestParam(required = false) Long unidadeId) {
        if (unidadeId != null) {
            return moradorService.listarPorUnidade(unidadeId);
        }
        return moradorService.listarTodos();
    }

    @GetMapping("/{id}")
    public Morador buscarPorId(@PathVariable Long id) {
        return moradorService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Morador criar(@Valid @RequestBody Morador morador) {
        return moradorService.criar(morador);
    }

    @PutMapping("/{id}")
    public Morador atualizar(@PathVariable Long id, @Valid @RequestBody Morador morador) {
        return moradorService.atualizar(id, morador);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        moradorService.deletar(id);
    }
}
