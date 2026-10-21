package br.com.sindipro.sindipro.controller;

import br.com.sindipro.sindipro.model.Encomenda;
import br.com.sindipro.sindipro.service.EncomendaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/encomendas")
public class EncomendaController {

    @Autowired
    private EncomendaService encomendaService;

    // GET /encomendas                  -> todas
    // GET /encomendas?pendentes=true   -> só as que ainda não foram retiradas
    // GET /encomendas?unidadeId=3      -> as dos moradores da unidade 3
    @GetMapping
    public List<Encomenda> listar(@RequestParam(required = false) Boolean pendentes,
                                  @RequestParam(required = false) Long unidadeId) {
        if (unidadeId != null) {
            return encomendaService.listarPorUnidade(unidadeId);
        }
        if (Boolean.TRUE.equals(pendentes)) {
            return encomendaService.listarPendentes();
        }
        return encomendaService.listarTodos();
    }

    @GetMapping("/{id}")
    public Encomenda buscarPorId(@PathVariable Long id) {
        return encomendaService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Encomenda criar(@Valid @RequestBody Encomenda encomenda) {
        return encomendaService.criar(encomenda);
    }

    @PutMapping("/{id}")
    public Encomenda atualizar(@PathVariable Long id, @Valid @RequestBody Encomenda encomenda) {
        return encomendaService.atualizar(id, encomenda);
    }

    // PUT /encomendas/5/retirar  -> "marcar como retirada". Não precisa de corpo (@RequestBody):
    // a ação já está dita na URL, e a hora quem coloca é o servidor.
    @PutMapping("/{id}/retirar")
    public Encomenda retirar(@PathVariable Long id) {
        return encomendaService.retirar(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        encomendaService.deletar(id);
    }
}
