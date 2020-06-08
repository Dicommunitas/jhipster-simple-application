package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.service.TarefaService;
import com.mycompany.myapp.domain.Tarefa;
import com.mycompany.myapp.repository.TarefaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Tarefa}.
 */
@Service
@Transactional
public class TarefaServiceImpl implements TarefaService {

    private final Logger log = LoggerFactory.getLogger(TarefaServiceImpl.class);

    private final TarefaRepository tarefaRepository;

    public TarefaServiceImpl(TarefaRepository tarefaRepository) {
        this.tarefaRepository = tarefaRepository;
    }

    /**
     * Save a tarefa.
     *
     * @param tarefa the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Tarefa save(Tarefa tarefa) {
        log.debug("Request to save Tarefa : {}", tarefa);
        return tarefaRepository.save(tarefa);
    }

    /**
     * Get all the tarefas.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Tarefa> findAll() {
        log.debug("Request to get all Tarefas");
        return tarefaRepository.findAll();
    }


    /**
     * Get one tarefa by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Tarefa> findOne(Long id) {
        log.debug("Request to get Tarefa : {}", id);
        return tarefaRepository.findById(id);
    }

    /**
     * Delete the tarefa by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Tarefa : {}", id);
        tarefaRepository.deleteById(id);
    }
}
