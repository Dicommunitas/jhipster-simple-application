package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.service.RegiaoService;
import com.mycompany.myapp.domain.Regiao;
import com.mycompany.myapp.repository.RegiaoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Regiao}.
 */
@Service
@Transactional
public class RegiaoServiceImpl implements RegiaoService {

    private final Logger log = LoggerFactory.getLogger(RegiaoServiceImpl.class);

    private final RegiaoRepository regiaoRepository;

    public RegiaoServiceImpl(RegiaoRepository regiaoRepository) {
        this.regiaoRepository = regiaoRepository;
    }

    /**
     * Save a regiao.
     *
     * @param regiao the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Regiao save(Regiao regiao) {
        log.debug("Request to save Regiao : {}", regiao);
        return regiaoRepository.save(regiao);
    }

    /**
     * Get all the regiaos.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Regiao> findAll() {
        log.debug("Request to get all Regiaos");
        return regiaoRepository.findAll();
    }


    /**
     * Get one regiao by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Regiao> findOne(Long id) {
        log.debug("Request to get Regiao : {}", id);
        return regiaoRepository.findById(id);
    }

    /**
     * Delete the regiao by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Regiao : {}", id);
        regiaoRepository.deleteById(id);
    }
}
