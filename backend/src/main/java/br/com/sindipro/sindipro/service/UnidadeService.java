package br.com.sindipro.sindipro.service;

import br.com.sindipro.sindipro.exception.RecursoNaoEncontradoException;
import br.com.sindipro.sindipro.exception.RegraNegocioException;
import br.com.sindipro.sindipro.model.Predio;
import br.com.sindipro.sindipro.model.Unidade;
import br.com.sindipro.sindipro.repository.MoradorRepository;
import br.com.sindipro.sindipro.repository.PredioRepository;
import br.com.sindipro.sindipro.repository.UnidadeRepository;
import br.com.sindipro.sindipro.repository.VagaGaragemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UnidadeService {

    @Autowired
    private UnidadeRepository unidadeRepository;

    @Autowired
    private PredioRepository predioRepository;

    @Autowired
    private MoradorRepository moradorRepository;

    @Autowired
    private VagaGaragemRepository vagaGaragemRepository;

    public List<Unidade> listarTodos() {
        return unidadeRepository.findAll();
    }

    public Unidade buscarPorId(Long id) {
        return unidadeRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Unidade " + id + " não encontrada"));
    }

    public Unidade criar(Unidade unidade) {
        unidade.setId(null);
        carregarPredio(unidade);
        return unidadeRepository.save(unidade);
    }

    public Unidade atualizar(Long id, Unidade dados) {
        buscarPorId(id);
        dados.setId(id);
        carregarPredio(dados);
        return unidadeRepository.save(dados);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        // REGRA: não apagar unidade que ainda tem moradores ou vagas ligadas a ela.
        if (moradorRepository.existsByUnidadeId(id)) {
            throw new RegraNegocioException("Não é possível excluir: a unidade ainda possui moradores");
        }
        if (vagaGaragemRepository.existsByUnidadeId(id)) {
            throw new RegraNegocioException("Não é possível excluir: a unidade ainda possui vagas de garagem");
        }
        unidadeRepository.deleteById(id);
    }

    // O JSON chega assim: { "bloco": "A", ..., "predio": { "id": 1 } }
    // Esse "predio" é só um objeto com o id preenchido. Aqui a gente:
    //   1) confirma que o prédio existe (senão seria um erro de foreign key no banco);
    //   2) troca pelo prédio COMPLETO vindo do banco, assim a resposta já volta com rua, nome, etc.
    private void carregarPredio(Unidade unidade) {
        Long predioId = unidade.getPredio().getId();
        if (predioId == null) {
            throw new RegraNegocioException("Informe o id do prédio: \"predio\": { \"id\": 1 }");
        }
        Predio predio = predioRepository.findById(predioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Prédio " + predioId + " não encontrado"));
        unidade.setPredio(predio);
    }
}
