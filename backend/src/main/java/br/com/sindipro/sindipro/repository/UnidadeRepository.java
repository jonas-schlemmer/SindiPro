package br.com.sindipro.sindipro.repository;

import br.com.sindipro.sindipro.model.Unidade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UnidadeRepository extends JpaRepository<Unidade, Long> {

    // MÉTODO DERIVADO: o Spring lê o NOME do método e monta o SQL sozinho.
    // existsBy + Predio + Id  ->  "existe alguma unidade cujo predio.id seja este?"
    // Usamos no Service para impedir apagar um prédio que ainda tem unidades.
    boolean existsByPredioId(Long predioId);
}
