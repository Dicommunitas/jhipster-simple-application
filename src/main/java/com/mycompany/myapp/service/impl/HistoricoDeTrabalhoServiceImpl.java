package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.service.HistoricoDeTrabalhoService;
import com.mycompany.myapp.domain.HistoricoDeTrabalho;
import com.mycompany.myapp.repository.HistoricoDeTrabalhoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link HistoricoDeTrabalho}.
 */
@Service
@Transactional
public class HistoricoDeTrabalhoServiceImpl implements HistoricoDeTrabalhoService {

    private final Logger log = LoggerFactory.getLogger(HistoricoDeTrabalhoServiceImpl.class);

    private final HistoricoDeTrabalhoRepository historicoDeTrabalhoRepository;

    public HistoricoDeTrabalhoServiceImpl(HistoricoDeTrabalhoRepository historicoDeTrabalhoRepository) {
        this.historicoDeTrabalhoRepository = historicoDeTrabalhoRepository;
    }

    /**
     * Save a historicoDeTrabalho.
     *
     * @param historicoDeTrabalho the entity to save.
     * @return the persisted entity.
     */
    @Override
    public HistoricoDeTrabalho save(HistoricoDeTrabalho historicoDeTrabalho) {
        log.debug("Request to save HistoricoDeTrabalho : {}", historicoDeTrabalho);
        return historicoDeTrabalhoRepository.save(historicoDeTrabalho);
    }

    /**
     * Get all the historicoDeTrabalhos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<HistoricoDeTrabalho> findAll(Pageable pageable) {
        log.debug("Request to get all HistoricoDeTrabalhos");
        return historicoDeTrabalhoRepository.findAll(pageable);
    }


    /**
     * Get one historicoDeTrabalho by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<HistoricoDeTrabalho> findOne(Long id) {
        log.debug("Request to get HistoricoDeTrabalho : {}", id);
        return historicoDeTrabalhoRepository.findById(id);
    }

    /**
     * Delete the historicoDeTrabalho by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete HistoricoDeTrabalho : {}", id);
        historicoDeTrabalhoRepository.deleteById(id);
    }
}
