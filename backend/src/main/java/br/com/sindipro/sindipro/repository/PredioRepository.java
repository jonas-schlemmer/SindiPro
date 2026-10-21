package br.com.sindipro.sindipro.repository;

import br.com.sindipro.sindipro.model.Predio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PredioRepository extends JpaRepository<Predio, Long> {
}
