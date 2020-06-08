package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.JhipsterSampleApplicationApp;
import com.mycompany.myapp.domain.Regiao;
import com.mycompany.myapp.repository.RegiaoRepository;
import com.mycompany.myapp.service.RegiaoService;

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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link RegiaoResource} REST controller.
 */
@SpringBootTest(classes = JhipsterSampleApplicationApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class RegiaoResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private RegiaoRepository regiaoRepository;

    @Autowired
    private RegiaoService regiaoService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRegiaoMockMvc;

    private Regiao regiao;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Regiao createEntity(EntityManager em) {
        Regiao regiao = new Regiao()
            .nome(DEFAULT_NOME);
        return regiao;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Regiao createUpdatedEntity(EntityManager em) {
        Regiao regiao = new Regiao()
            .nome(UPDATED_NOME);
        return regiao;
    }

    @BeforeEach
    public void initTest() {
        regiao = createEntity(em);
    }

    @Test
    @Transactional
    public void createRegiao() throws Exception {
        int databaseSizeBeforeCreate = regiaoRepository.findAll().size();
        // Create the Regiao
        restRegiaoMockMvc.perform(post("/api/regiaos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(regiao)))
            .andExpect(status().isCreated());

        // Validate the Regiao in the database
        List<Regiao> regiaoList = regiaoRepository.findAll();
        assertThat(regiaoList).hasSize(databaseSizeBeforeCreate + 1);
        Regiao testRegiao = regiaoList.get(regiaoList.size() - 1);
        assertThat(testRegiao.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    public void createRegiaoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = regiaoRepository.findAll().size();

        // Create the Regiao with an existing ID
        regiao.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRegiaoMockMvc.perform(post("/api/regiaos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(regiao)))
            .andExpect(status().isBadRequest());

        // Validate the Regiao in the database
        List<Regiao> regiaoList = regiaoRepository.findAll();
        assertThat(regiaoList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllRegiaos() throws Exception {
        // Initialize the database
        regiaoRepository.saveAndFlush(regiao);

        // Get all the regiaoList
        restRegiaoMockMvc.perform(get("/api/regiaos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(regiao.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)));
    }
    
    @Test
    @Transactional
    public void getRegiao() throws Exception {
        // Initialize the database
        regiaoRepository.saveAndFlush(regiao);

        // Get the regiao
        restRegiaoMockMvc.perform(get("/api/regiaos/{id}", regiao.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(regiao.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME));
    }
    @Test
    @Transactional
    public void getNonExistingRegiao() throws Exception {
        // Get the regiao
        restRegiaoMockMvc.perform(get("/api/regiaos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRegiao() throws Exception {
        // Initialize the database
        regiaoService.save(regiao);

        int databaseSizeBeforeUpdate = regiaoRepository.findAll().size();

        // Update the regiao
        Regiao updatedRegiao = regiaoRepository.findById(regiao.getId()).get();
        // Disconnect from session so that the updates on updatedRegiao are not directly saved in db
        em.detach(updatedRegiao);
        updatedRegiao
            .nome(UPDATED_NOME);

        restRegiaoMockMvc.perform(put("/api/regiaos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedRegiao)))
            .andExpect(status().isOk());

        // Validate the Regiao in the database
        List<Regiao> regiaoList = regiaoRepository.findAll();
        assertThat(regiaoList).hasSize(databaseSizeBeforeUpdate);
        Regiao testRegiao = regiaoList.get(regiaoList.size() - 1);
        assertThat(testRegiao.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    public void updateNonExistingRegiao() throws Exception {
        int databaseSizeBeforeUpdate = regiaoRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegiaoMockMvc.perform(put("/api/regiaos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(regiao)))
            .andExpect(status().isBadRequest());

        // Validate the Regiao in the database
        List<Regiao> regiaoList = regiaoRepository.findAll();
        assertThat(regiaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteRegiao() throws Exception {
        // Initialize the database
        regiaoService.save(regiao);

        int databaseSizeBeforeDelete = regiaoRepository.findAll().size();

        // Delete the regiao
        restRegiaoMockMvc.perform(delete("/api/regiaos/{id}", regiao.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Regiao> regiaoList = regiaoRepository.findAll();
        assertThat(regiaoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
