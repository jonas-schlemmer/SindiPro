package br.com.sindipro.sindipro.repository;

import br.com.sindipro.sindipro.model.VagaGaragem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VagaGaragemRepository extends JpaRepository<VagaGaragem, Long> {

    boolean existsByUnidadeId(Long unidadeId);

    List<VagaGaragem> findByUnidadeId(Long unidadeId);
}
