package br.com.sindipro.sindipro.service;

import br.com.sindipro.sindipro.exception.RecursoNaoEncontradoException;
import br.com.sindipro.sindipro.exception.RegraNegocioException;
import br.com.sindipro.sindipro.model.Unidade;
import br.com.sindipro.sindipro.model.VagaGaragem;
import br.com.sindipro.sindipro.repository.UnidadeRepository;
import br.com.sindipro.sindipro.repository.VagaGaragemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VagaGaragemService {

    @Autowired
    private VagaGaragemRepository vagaGaragemRepository;

    @Autowired
    private UnidadeRepository unidadeRepository;

    public List<VagaGaragem> listarTodos() {
        return vagaGaragemRepository.findAll();
    }

    public List<VagaGaragem> listarPorUnidade(Long unidadeId) {
        return vagaGaragemRepository.findByUnidadeId(unidadeId);
    }

    public VagaGaragem buscarPorId(Long id) {
        return vagaGaragemRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Vaga " + id + " não encontrada"));
    }

    public VagaGaragem criar(VagaGaragem vaga) {
        vaga.setId(null);
        preparar(vaga);
        return vagaGaragemRepository.save(vaga);
    }

    public VagaGaragem atualizar(Long id, VagaGaragem dados) {
        buscarPorId(id);
        dados.setId(id);
        preparar(dados);
        return vagaGaragemRepository.save(dados);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        vagaGaragemRepository.deleteById(id);
    }

    private void preparar(VagaGaragem vaga) {
        if (vaga.getCoberta() == null) {
            vaga.setCoberta(false);
        }
        // RELAÇÃO OPCIONAL: só validamos a unidade SE ela foi informada.
        // Uma vaga sem unidade é uma vaga livre, e isso é permitido.
        if (vaga.getUnidade() != null) {
            Long unidadeId = vaga.getUnidade().getId();
            if (unidadeId == null) {
                throw new RegraNegocioException("Informe o id da unidade ou envie unidade como null");
            }
            Unidade unidade = unidadeRepository.findById(unidadeId)
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Unidade " + unidadeId + " não encontrada"));
            vaga.setUnidade(unidade);
        }
    }
}
