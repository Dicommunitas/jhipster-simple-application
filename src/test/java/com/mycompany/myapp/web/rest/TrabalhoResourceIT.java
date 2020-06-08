package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.JhipsterSampleApplicationApp;
import com.mycompany.myapp.domain.Trabalho;
import com.mycompany.myapp.repository.TrabalhoRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link TrabalhoResource} REST controller.
 */
@SpringBootTest(classes = JhipsterSampleApplicationApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class TrabalhoResourceIT {

    private static final String DEFAULT_TITULO = "AAAAAAAAAA";
    private static final String UPDATED_TITULO = "BBBBBBBBBB";

    private static final Long DEFAULT_SALARIO_MINIMO = 1L;
    private static final Long UPDATED_SALARIO_MINIMO = 2L;

    private static final Long DEFAULT_SALARIO_MAXIMO = 1L;
    private static final Long UPDATED_SALARIO_MAXIMO = 2L;

    @Autowired
    private TrabalhoRepository trabalhoRepository;

    @Mock
    private TrabalhoRepository trabalhoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTrabalhoMockMvc;

    private Trabalho trabalho;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Trabalho createEntity(EntityManager em) {
        Trabalho trabalho = new Trabalho()
            .titulo(DEFAULT_TITULO)
            .salarioMinimo(DEFAULT_SALARIO_MINIMO)
            .salarioMaximo(DEFAULT_SALARIO_MAXIMO);
        return trabalho;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Trabalho createUpdatedEntity(EntityManager em) {
        Trabalho trabalho = new Trabalho()
            .titulo(UPDATED_TITULO)
            .salarioMinimo(UPDATED_SALARIO_MINIMO)
            .salarioMaximo(UPDATED_SALARIO_MAXIMO);
        return trabalho;
    }

    @BeforeEach
    public void initTest() {
        trabalho = createEntity(em);
    }

    @Test
    @Transactional
    public void createTrabalho() throws Exception {
        int databaseSizeBeforeCreate = trabalhoRepository.findAll().size();
        // Create the Trabalho
        restTrabalhoMockMvc.perform(post("/api/trabalhos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(trabalho)))
            .andExpect(status().isCreated());

        // Validate the Trabalho in the database
        List<Trabalho> trabalhoList = trabalhoRepository.findAll();
        assertThat(trabalhoList).hasSize(databaseSizeBeforeCreate + 1);
        Trabalho testTrabalho = trabalhoList.get(trabalhoList.size() - 1);
        assertThat(testTrabalho.getTitulo()).isEqualTo(DEFAULT_TITULO);
        assertThat(testTrabalho.getSalarioMinimo()).isEqualTo(DEFAULT_SALARIO_MINIMO);
        assertThat(testTrabalho.getSalarioMaximo()).isEqualTo(DEFAULT_SALARIO_MAXIMO);
    }

    @Test
    @Transactional
    public void createTrabalhoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = trabalhoRepository.findAll().size();

        // Create the Trabalho with an existing ID
        trabalho.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTrabalhoMockMvc.perform(post("/api/trabalhos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(trabalho)))
            .andExpect(status().isBadRequest());

        // Validate the Trabalho in the database
        List<Trabalho> trabalhoList = trabalhoRepository.findAll();
        assertThat(trabalhoList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllTrabalhos() throws Exception {
        // Initialize the database
        trabalhoRepository.saveAndFlush(trabalho);

        // Get all the trabalhoList
        restTrabalhoMockMvc.perform(get("/api/trabalhos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(trabalho.getId().intValue())))
            .andExpect(jsonPath("$.[*].titulo").value(hasItem(DEFAULT_TITULO)))
            .andExpect(jsonPath("$.[*].salarioMinimo").value(hasItem(DEFAULT_SALARIO_MINIMO.intValue())))
            .andExpect(jsonPath("$.[*].salarioMaximo").value(hasItem(DEFAULT_SALARIO_MAXIMO.intValue())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllTrabalhosWithEagerRelationshipsIsEnabled() throws Exception {
        when(trabalhoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTrabalhoMockMvc.perform(get("/api/trabalhos?eagerload=true"))
            .andExpect(status().isOk());

        verify(trabalhoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllTrabalhosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(trabalhoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTrabalhoMockMvc.perform(get("/api/trabalhos?eagerload=true"))
            .andExpect(status().isOk());

        verify(trabalhoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getTrabalho() throws Exception {
        // Initialize the database
        trabalhoRepository.saveAndFlush(trabalho);

        // Get the trabalho
        restTrabalhoMockMvc.perform(get("/api/trabalhos/{id}", trabalho.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(trabalho.getId().intValue()))
            .andExpect(jsonPath("$.titulo").value(DEFAULT_TITULO))
            .andExpect(jsonPath("$.salarioMinimo").value(DEFAULT_SALARIO_MINIMO.intValue()))
            .andExpect(jsonPath("$.salarioMaximo").value(DEFAULT_SALARIO_MAXIMO.intValue()));
    }
    @Test
    @Transactional
    public void getNonExistingTrabalho() throws Exception {
        // Get the trabalho
        restTrabalhoMockMvc.perform(get("/api/trabalhos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTrabalho() throws Exception {
        // Initialize the database
        trabalhoRepository.saveAndFlush(trabalho);

        int databaseSizeBeforeUpdate = trabalhoRepository.findAll().size();

        // Update the trabalho
        Trabalho updatedTrabalho = trabalhoRepository.findById(trabalho.getId()).get();
        // Disconnect from session so that the updates on updatedTrabalho are not directly saved in db
        em.detach(updatedTrabalho);
        updatedTrabalho
            .titulo(UPDATED_TITULO)
            .salarioMinimo(UPDATED_SALARIO_MINIMO)
            .salarioMaximo(UPDATED_SALARIO_MAXIMO);

        restTrabalhoMockMvc.perform(put("/api/trabalhos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedTrabalho)))
            .andExpect(status().isOk());

        // Validate the Trabalho in the database
        List<Trabalho> trabalhoList = trabalhoRepository.findAll();
        assertThat(trabalhoList).hasSize(databaseSizeBeforeUpdate);
        Trabalho testTrabalho = trabalhoList.get(trabalhoList.size() - 1);
        assertThat(testTrabalho.getTitulo()).isEqualTo(UPDATED_TITULO);
        assertThat(testTrabalho.getSalarioMinimo()).isEqualTo(UPDATED_SALARIO_MINIMO);
        assertThat(testTrabalho.getSalarioMaximo()).isEqualTo(UPDATED_SALARIO_MAXIMO);
    }

    @Test
    @Transactional
    public void updateNonExistingTrabalho() throws Exception {
        int databaseSizeBeforeUpdate = trabalhoRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrabalhoMockMvc.perform(put("/api/trabalhos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(trabalho)))
            .andExpect(status().isBadRequest());

        // Validate the Trabalho in the database
        List<Trabalho> trabalhoList = trabalhoRepository.findAll();
        assertThat(trabalhoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTrabalho() throws Exception {
        // Initialize the database
        trabalhoRepository.saveAndFlush(trabalho);

        int databaseSizeBeforeDelete = trabalhoRepository.findAll().size();

        // Delete the trabalho
        restTrabalhoMockMvc.perform(delete("/api/trabalhos/{id}", trabalho.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Trabalho> trabalhoList = trabalhoRepository.findAll();
        assertThat(trabalhoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
