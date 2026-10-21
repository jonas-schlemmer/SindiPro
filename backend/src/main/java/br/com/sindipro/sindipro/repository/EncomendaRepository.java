package br.com.sindipro.sindipro.repository;

import br.com.sindipro.sindipro.model.Encomenda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EncomendaRepository extends JpaRepository<Encomenda, Long> {

    // Impede apagar um morador que ainda tem encomendas registradas.
    boolean existsByMoradorId(Long moradorId);

    // "DataRetirada IsNull" -> encomendas ainda não retiradas (equivale a WHERE data_retirada IS NULL).
    List<Encomenda> findByDataRetiradaIsNull();

    // Encomendas de todos os moradores de uma unidade (navega morador -> unidade -> id).
    List<Encomenda> findByMoradorUnidadeId(Long unidadeId);
}
