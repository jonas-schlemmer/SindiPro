package br.com.sindipro.sindipro.service;

import br.com.sindipro.sindipro.exception.RecursoNaoEncontradoException;
import br.com.sindipro.sindipro.exception.RegraNegocioException;
import br.com.sindipro.sindipro.model.Predio;
import br.com.sindipro.sindipro.repository.PredioRepository;
import br.com.sindipro.sindipro.repository.UnidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PredioService {

    @Autowired
    private PredioRepository predioRepository;

    // Este Service precisa de um SEGUNDO repository só para checar a regra de apagar.
    @Autowired
    private UnidadeRepository unidadeRepository;

    public List<Predio> listarTodos() {
        return predioRepository.findAll();
    }

    // MUDANÇA: antes era .orElse(null). Devolver null obriga o Controller a lembrar de checar,
    // e o React recebia um "200 OK" vazio. Agora lançamos a exceção e o TratadorDeExcecoes devolve 404.
    public Predio buscarPorId(Long id) {
        return predioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Prédio " + id + " não encontrado"));
    }

    public Predio criar(Predio predio) {
        // Garante que é INSERT: se alguém mandar "id" no JSON do POST, ignoramos.
        predio.setId(null);
        return predioRepository.save(predio);
    }

    public Predio atualizar(Long id, Predio dados) {
        buscarPorId(id); // se não existir, já lança 404 aqui
        dados.setId(id);
        return predioRepository.save(dados);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        // REGRA DE NEGÓCIO: não apagar prédio que ainda tem unidades.
        // Sem essa checagem o banco recusaria (foreign key) e o usuário veria um erro 500 incompreensível.
        if (unidadeRepository.existsByPredioId(id)) {
            throw new RegraNegocioException("Não é possível excluir: o prédio ainda possui unidades cadastradas");
        }
        predioRepository.deleteById(id);
    }
}
