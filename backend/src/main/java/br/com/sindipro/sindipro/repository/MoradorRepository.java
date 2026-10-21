package br.com.sindipro.sindipro.repository;

import br.com.sindipro.sindipro.model.Morador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MoradorRepository extends JpaRepository<Morador, Long> {

    // Usado ao CADASTRAR: "já existe alguém com esse CPF?"
    boolean existsByCpf(String cpf);

    // Usado ao ATUALIZAR: "existe OUTRA pessoa (id diferente) com esse CPF?"
    // Sem o "IdNot", o morador não conseguiria salvar a si mesmo sem bater no próprio CPF.
    boolean existsByCpfAndIdNot(String cpf, Long id);

    // Impede apagar uma unidade que ainda tem moradores.
    boolean existsByUnidadeId(Long unidadeId);

    // Usado na tela de unidades: moradores de uma unidade.
    List<Morador> findByUnidadeId(Long unidadeId);
}
