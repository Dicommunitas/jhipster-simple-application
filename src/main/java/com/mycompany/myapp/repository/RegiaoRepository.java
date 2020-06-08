package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Regiao;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Regiao entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RegiaoRepository extends JpaRepository<Regiao, Long> {
}
