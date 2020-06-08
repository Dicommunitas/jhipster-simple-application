package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.HistoricoDeTrabalho;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link HistoricoDeTrabalho}.
 */
public interface HistoricoDeTrabalhoService {

    /**
     * Save a historicoDeTrabalho.
     *
     * @param historicoDeTrabalho the entity to save.
     * @return the persisted entity.
     */
    HistoricoDeTrabalho save(HistoricoDeTrabalho historicoDeTrabalho);

    /**
     * Get all the historicoDeTrabalhos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<HistoricoDeTrabalho> findAll(Pageable pageable);


    /**
     * Get the "id" historicoDeTrabalho.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<HistoricoDeTrabalho> findOne(Long id);

    /**
     * Delete the "id" historicoDeTrabalho.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
