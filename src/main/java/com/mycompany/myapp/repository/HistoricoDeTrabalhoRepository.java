package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.HistoricoDeTrabalho;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the HistoricoDeTrabalho entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HistoricoDeTrabalhoRepository extends JpaRepository<HistoricoDeTrabalho, Long> {
}
