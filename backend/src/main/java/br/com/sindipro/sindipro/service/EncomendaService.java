package br.com.sindipro.sindipro.service;

import br.com.sindipro.sindipro.exception.RecursoNaoEncontradoException;
import br.com.sindipro.sindipro.exception.RegraNegocioException;
import br.com.sindipro.sindipro.model.Encomenda;
import br.com.sindipro.sindipro.model.Morador;
import br.com.sindipro.sindipro.repository.EncomendaRepository;
import br.com.sindipro.sindipro.repository.MoradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EncomendaService {

    @Autowired
    private EncomendaRepository encomendaRepository;

    @Autowired
    private MoradorRepository moradorRepository;

    public List<Encomenda> listarTodos() {
        return encomendaRepository.findAll();
    }

    // Só as que ainda estão na portaria esperando o morador buscar.
    public List<Encomenda> listarPendentes() {
        return encomendaRepository.findByDataRetiradaIsNull();
    }

    public List<Encomenda> listarPorUnidade(Long unidadeId) {
        return encomendaRepository.findByMoradorUnidadeId(unidadeId);
    }

    public Encomenda buscarPorId(Long id) {
        return encomendaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Encomenda " + id + " não encontrada"));
    }

    public Encomenda criar(Encomenda encomenda) {
        encomenda.setId(null);
        carregarMorador(encomenda);
        // Quem registra a chegada não precisa informar a hora: o sistema marca "agora".
        if (encomenda.getDataRecebimento() == null) {
            encomenda.setDataRecebimento(LocalDateTime.now());
        }
        // Encomenda nova nunca nasce retirada.
        encomenda.setDataRetirada(null);
        return encomendaRepository.save(encomenda);
    }

    public Encomenda atualizar(Long id, Encomenda dados) {
        Encomenda existente = buscarPorId(id);
        dados.setId(id);
        carregarMorador(dados);
        if (dados.getDataRecebimento() == null) {
            dados.setDataRecebimento(existente.getDataRecebimento());
        }
        // Atualizar os dados NÃO mexe na retirada: para isso existe o método retirar().
        dados.setDataRetirada(existente.getDataRetirada());
        return encomendaRepository.save(dados);
    }

    // "Marcar como retirada": em vez de apagar a encomenda, guardamos QUANDO foi retirada.
    // Assim o histórico não se perde.
    public Encomenda retirar(Long id) {
        Encomenda encomenda = buscarPorId(id);
        if (encomenda.getDataRetirada() != null) {
            throw new RegraNegocioException("Esta encomenda já foi retirada");
        }
        encomenda.setDataRetirada(LocalDateTime.now());
        return encomendaRepository.save(encomenda);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        encomendaRepository.deleteById(id);
    }

    private void carregarMorador(Encomenda encomenda) {
        Long moradorId = encomenda.getMorador().getId();
        if (moradorId == null) {
            throw new RegraNegocioException("Informe o id do morador: \"morador\": { \"id\": 1 }");
        }
        Morador morador = moradorRepository.findById(moradorId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Morador " + moradorId + " não encontrado"));
        encomenda.setMorador(morador);
    }
}
