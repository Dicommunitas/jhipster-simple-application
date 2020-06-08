package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Empregado;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Empregado entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmpregadoRepository extends JpaRepository<Empregado, Long> {
}
