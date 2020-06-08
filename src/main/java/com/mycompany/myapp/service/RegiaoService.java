package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Regiao;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Regiao}.
 */
public interface RegiaoService {

    /**
     * Save a regiao.
     *
     * @param regiao the entity to save.
     * @return the persisted entity.
     */
    Regiao save(Regiao regiao);

    /**
     * Get all the regiaos.
     *
     * @return the list of entities.
     */
    List<Regiao> findAll();


    /**
     * Get the "id" regiao.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Regiao> findOne(Long id);

    /**
     * Delete the "id" regiao.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
