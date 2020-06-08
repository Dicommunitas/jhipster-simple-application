package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.service.DepartamentoService;
import com.mycompany.myapp.domain.Departamento;
import com.mycompany.myapp.repository.DepartamentoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Departamento}.
 */
@Service
@Transactional
public class DepartamentoServiceImpl implements DepartamentoService {

    private final Logger log = LoggerFactory.getLogger(DepartamentoServiceImpl.class);

    private final DepartamentoRepository departamentoRepository;

    public DepartamentoServiceImpl(DepartamentoRepository departamentoRepository) {
        this.departamentoRepository = departamentoRepository;
    }

    /**
     * Save a departamento.
     *
     * @param departamento the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Departamento save(Departamento departamento) {
        log.debug("Request to save Departamento : {}", departamento);
        return departamentoRepository.save(departamento);
    }

    /**
     * Get all the departamentos.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Departamento> findAll() {
        log.debug("Request to get all Departamentos");
        return departamentoRepository.findAll();
    }


    /**
     * Get one departamento by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Departamento> findOne(Long id) {
        log.debug("Request to get Departamento : {}", id);
        return departamentoRepository.findById(id);
    }

    /**
     * Delete the departamento by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Departamento : {}", id);
        departamentoRepository.deleteById(id);
    }
}
