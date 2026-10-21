package br.com.sindipro.sindipro.service;

import br.com.sindipro.sindipro.exception.RecursoNaoEncontradoException;
import br.com.sindipro.sindipro.exception.RegraNegocioException;
import br.com.sindipro.sindipro.model.Morador;
import br.com.sindipro.sindipro.model.Unidade;
import br.com.sindipro.sindipro.repository.EncomendaRepository;
import br.com.sindipro.sindipro.repository.MoradorRepository;
import br.com.sindipro.sindipro.repository.UnidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MoradorService {

    @Autowired
    private MoradorRepository moradorRepository;

    @Autowired
    private UnidadeRepository unidadeRepository;

    @Autowired
    private EncomendaRepository encomendaRepository;

    public List<Morador> listarTodos() {
        return moradorRepository.findAll();
    }

    // Filtro usado pela tela de unidades: "me mostre só os moradores da unidade X".
    public List<Morador> listarPorUnidade(Long unidadeId) {
        return moradorRepository.findByUnidadeId(unidadeId);
    }

    public Morador buscarPorId(Long id) {
        return moradorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Morador " + id + " não encontrado"));
    }

    public Morador criar(Morador morador) {
        morador.setId(null);
        morador.setCpf(formatarCpf(morador.getCpf()));
        carregarUnidade(morador);
        validarTipo(morador);

        // REGRA: CPF único. A trava no banco (UNIQUE) é a última linha de defesa,
        // mas ela só devolve um erro técnico. Aqui checamos ANTES e damos uma mensagem amigável.
        if (moradorRepository.existsByCpf(morador.getCpf())) {
            throw new RegraNegocioException("Já existe um morador cadastrado com o CPF " + morador.getCpf());
        }
        return moradorRepository.save(morador);
    }

    public Morador atualizar(Long id, Morador dados) {
        buscarPorId(id);
        dados.setId(id);
        dados.setCpf(formatarCpf(dados.getCpf()));
        carregarUnidade(dados);
        validarTipo(dados);

        // Aqui usamos "AndIdNot": só é duplicado se for OUTRA pessoa com o mesmo CPF.
        if (moradorRepository.existsByCpfAndIdNot(dados.getCpf(), id)) {
            throw new RegraNegocioException("Já existe outro morador cadastrado com o CPF " + dados.getCpf());
        }
        return moradorRepository.save(dados);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        if (encomendaRepository.existsByMoradorId(id)) {
            throw new RegraNegocioException("Não é possível excluir: o morador possui encomendas registradas");
        }
        moradorRepository.deleteById(id);
    }

    // Padroniza o CPF para 000.000.000-00. Sem isso, "12345678901" e "123.456.789-01"
    // seriam tratados como CPFs diferentes e a regra de CPF único furaria.
    private String formatarCpf(String cpf) {
        String numeros = cpf.replaceAll("\\D", "");
        return numeros.substring(0, 3) + "." + numeros.substring(3, 6) + "."
                + numeros.substring(6, 9) + "-" + numeros.substring(9, 11);
    }

    private void carregarUnidade(Morador morador) {
        Long unidadeId = morador.getUnidade().getId();
        if (unidadeId == null) {
            throw new RegraNegocioException("Informe o id da unidade: \"unidade\": { \"id\": 1 }");
        }
        Unidade unidade = unidadeRepository.findById(unidadeId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Unidade " + unidadeId + " não encontrada"));
        morador.setUnidade(unidade);
    }

    // Como Inquilino e Proprietário estão na MESMA tabela, os campos que não se aplicam ficam nulos.
    // Esta checagem garante que a tabela não fique com dados contraditórios.
    private void validarTipo(Morador morador) {
        if (morador.getTipo().equals("INQUILINO")) {
            if (morador.getValorAluguel() == null) {
                throw new RegraNegocioException("Inquilino precisa ter o valor do aluguel");
            }
            morador.setTemPosse(null);
        } else {
            morador.setTemPosse(true);
            morador.setValorAluguel(null);
        }
    }
}
