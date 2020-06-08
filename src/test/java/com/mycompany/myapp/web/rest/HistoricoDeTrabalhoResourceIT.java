package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.JhipsterSampleApplicationApp;
import com.mycompany.myapp.domain.HistoricoDeTrabalho;
import com.mycompany.myapp.repository.HistoricoDeTrabalhoRepository;
import com.mycompany.myapp.service.HistoricoDeTrabalhoService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.domain.enumeration.Lingua;
/**
 * Integration tests for the {@link HistoricoDeTrabalhoResource} REST controller.
 */
@SpringBootTest(classes = JhipsterSampleApplicationApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class HistoricoDeTrabalhoResourceIT {

    private static final Instant DEFAULT_DATA_INICIAL = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATA_INICIAL = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATA_FINAL = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATA_FINAL = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Lingua DEFAULT_LINGUA = Lingua.PORTUGUESE;
    private static final Lingua UPDATED_LINGUA = Lingua.ENGLISH;

    @Autowired
    private HistoricoDeTrabalhoRepository historicoDeTrabalhoRepository;

    @Autowired
    private HistoricoDeTrabalhoService historicoDeTrabalhoService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHistoricoDeTrabalhoMockMvc;

    private HistoricoDeTrabalho historicoDeTrabalho;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HistoricoDeTrabalho createEntity(EntityManager em) {
        HistoricoDeTrabalho historicoDeTrabalho = new HistoricoDeTrabalho()
            .dataInicial(DEFAULT_DATA_INICIAL)
            .dataFinal(DEFAULT_DATA_FINAL)
            .lingua(DEFAULT_LINGUA);
        return historicoDeTrabalho;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HistoricoDeTrabalho createUpdatedEntity(EntityManager em) {
        HistoricoDeTrabalho historicoDeTrabalho = new HistoricoDeTrabalho()
            .dataInicial(UPDATED_DATA_INICIAL)
            .dataFinal(UPDATED_DATA_FINAL)
            .lingua(UPDATED_LINGUA);
        return historicoDeTrabalho;
    }

    @BeforeEach
    public void initTest() {
        historicoDeTrabalho = createEntity(em);
    }

    @Test
    @Transactional
    public void createHistoricoDeTrabalho() throws Exception {
        int databaseSizeBeforeCreate = historicoDeTrabalhoRepository.findAll().size();
        // Create the HistoricoDeTrabalho
        restHistoricoDeTrabalhoMockMvc.perform(post("/api/historico-de-trabalhos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(historicoDeTrabalho)))
            .andExpect(status().isCreated());

        // Validate the HistoricoDeTrabalho in the database
        List<HistoricoDeTrabalho> historicoDeTrabalhoList = historicoDeTrabalhoRepository.findAll();
        assertThat(historicoDeTrabalhoList).hasSize(databaseSizeBeforeCreate + 1);
        HistoricoDeTrabalho testHistoricoDeTrabalho = historicoDeTrabalhoList.get(historicoDeTrabalhoList.size() - 1);
        assertThat(testHistoricoDeTrabalho.getDataInicial()).isEqualTo(DEFAULT_DATA_INICIAL);
        assertThat(testHistoricoDeTrabalho.getDataFinal()).isEqualTo(DEFAULT_DATA_FINAL);
        assertThat(testHistoricoDeTrabalho.getLingua()).isEqualTo(DEFAULT_LINGUA);
    }

    @Test
    @Transactional
    public void createHistoricoDeTrabalhoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = historicoDeTrabalhoRepository.findAll().size();

        // Create the HistoricoDeTrabalho with an existing ID
        historicoDeTrabalho.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restHistoricoDeTrabalhoMockMvc.perform(post("/api/historico-de-trabalhos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(historicoDeTrabalho)))
            .andExpect(status().isBadRequest());

        // Validate the HistoricoDeTrabalho in the database
        List<HistoricoDeTrabalho> historicoDeTrabalhoList = historicoDeTrabalhoRepository.findAll();
        assertThat(historicoDeTrabalhoList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllHistoricoDeTrabalhos() throws Exception {
        // Initialize the database
        historicoDeTrabalhoRepository.saveAndFlush(historicoDeTrabalho);

        // Get all the historicoDeTrabalhoList
        restHistoricoDeTrabalhoMockMvc.perform(get("/api/historico-de-trabalhos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(historicoDeTrabalho.getId().intValue())))
            .andExpect(jsonPath("$.[*].dataInicial").value(hasItem(DEFAULT_DATA_INICIAL.toString())))
            .andExpect(jsonPath("$.[*].dataFinal").value(hasItem(DEFAULT_DATA_FINAL.toString())))
            .andExpect(jsonPath("$.[*].lingua").value(hasItem(DEFAULT_LINGUA.toString())));
    }
    
    @Test
    @Transactional
    public void getHistoricoDeTrabalho() throws Exception {
        // Initialize the database
        historicoDeTrabalhoRepository.saveAndFlush(historicoDeTrabalho);

        // Get the historicoDeTrabalho
        restHistoricoDeTrabalhoMockMvc.perform(get("/api/historico-de-trabalhos/{id}", historicoDeTrabalho.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(historicoDeTrabalho.getId().intValue()))
            .andExpect(jsonPath("$.dataInicial").value(DEFAULT_DATA_INICIAL.toString()))
            .andExpect(jsonPath("$.dataFinal").value(DEFAULT_DATA_FINAL.toString()))
            .andExpect(jsonPath("$.lingua").value(DEFAULT_LINGUA.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingHistoricoDeTrabalho() throws Exception {
        // Get the historicoDeTrabalho
        restHistoricoDeTrabalhoMockMvc.perform(get("/api/historico-de-trabalhos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateHistoricoDeTrabalho() throws Exception {
        // Initialize the database
        historicoDeTrabalhoService.save(historicoDeTrabalho);

        int databaseSizeBeforeUpdate = historicoDeTrabalhoRepository.findAll().size();

        // Update the historicoDeTrabalho
        HistoricoDeTrabalho updatedHistoricoDeTrabalho = historicoDeTrabalhoRepository.findById(historicoDeTrabalho.getId()).get();
        // Disconnect from session so that the updates on updatedHistoricoDeTrabalho are not directly saved in db
        em.detach(updatedHistoricoDeTrabalho);
        updatedHistoricoDeTrabalho
            .dataInicial(UPDATED_DATA_INICIAL)
            .dataFinal(UPDATED_DATA_FINAL)
            .lingua(UPDATED_LINGUA);

        restHistoricoDeTrabalhoMockMvc.perform(put("/api/historico-de-trabalhos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedHistoricoDeTrabalho)))
            .andExpect(status().isOk());

        // Validate the HistoricoDeTrabalho in the database
        List<HistoricoDeTrabalho> historicoDeTrabalhoList = historicoDeTrabalhoRepository.findAll();
        assertThat(historicoDeTrabalhoList).hasSize(databaseSizeBeforeUpdate);
        HistoricoDeTrabalho testHistoricoDeTrabalho = historicoDeTrabalhoList.get(historicoDeTrabalhoList.size() - 1);
        assertThat(testHistoricoDeTrabalho.getDataInicial()).isEqualTo(UPDATED_DATA_INICIAL);
        assertThat(testHistoricoDeTrabalho.getDataFinal()).isEqualTo(UPDATED_DATA_FINAL);
        assertThat(testHistoricoDeTrabalho.getLingua()).isEqualTo(UPDATED_LINGUA);
    }

    @Test
    @Transactional
    public void updateNonExistingHistoricoDeTrabalho() throws Exception {
        int databaseSizeBeforeUpdate = historicoDeTrabalhoRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHistoricoDeTrabalhoMockMvc.perform(put("/api/historico-de-trabalhos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(historicoDeTrabalho)))
            .andExpect(status().isBadRequest());

        // Validate the HistoricoDeTrabalho in the database
        List<HistoricoDeTrabalho> historicoDeTrabalhoList = historicoDeTrabalhoRepository.findAll();
        assertThat(historicoDeTrabalhoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteHistoricoDeTrabalho() throws Exception {
        // Initialize the database
        historicoDeTrabalhoService.save(historicoDeTrabalho);

        int databaseSizeBeforeDelete = historicoDeTrabalhoRepository.findAll().size();

        // Delete the historicoDeTrabalho
        restHistoricoDeTrabalhoMockMvc.perform(delete("/api/historico-de-trabalhos/{id}", historicoDeTrabalho.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<HistoricoDeTrabalho> historicoDeTrabalhoList = historicoDeTrabalhoRepository.findAll();
        assertThat(historicoDeTrabalhoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
