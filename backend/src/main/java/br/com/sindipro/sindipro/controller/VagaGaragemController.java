package br.com.sindipro.sindipro.controller;

import br.com.sindipro.sindipro.model.VagaGaragem;
import br.com.sindipro.sindipro.service.VagaGaragemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vagas")
public class VagaGaragemController {

    @Autowired
    private VagaGaragemService vagaGaragemService;

    @GetMapping
    public List<VagaGaragem> listar(@RequestParam(required = false) Long unidadeId) {
        if (unidadeId != null) {
            return vagaGaragemService.listarPorUnidade(unidadeId);
        }
        return vagaGaragemService.listarTodos();
    }

    @GetMapping("/{id}")
    public VagaGaragem buscarPorId(@PathVariable Long id) {
        return vagaGaragemService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VagaGaragem criar(@Valid @RequestBody VagaGaragem vaga) {
        return vagaGaragemService.criar(vaga);
    }

    @PutMapping("/{id}")
    public VagaGaragem atualizar(@PathVariable Long id, @Valid @RequestBody VagaGaragem vaga) {
        return vagaGaragemService.atualizar(id, vaga);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        vagaGaragemService.deletar(id);
    }
}
