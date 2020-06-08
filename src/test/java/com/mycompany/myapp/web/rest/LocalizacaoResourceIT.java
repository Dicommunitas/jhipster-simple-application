package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.JhipsterSampleApplicationApp;
import com.mycompany.myapp.domain.Localizacao;
import com.mycompany.myapp.repository.LocalizacaoRepository;
import com.mycompany.myapp.service.LocalizacaoService;

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
 * Integration tests for the {@link LocalizacaoResource} REST controller.
 */
@SpringBootTest(classes = JhipsterSampleApplicationApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class LocalizacaoResourceIT {

    private static final String DEFAULT_ENDERECO = "AAAAAAAAAA";
    private static final String UPDATED_ENDERECO = "BBBBBBBBBB";

    private static final String DEFAULT_CEP = "AAAAAAAAAA";
    private static final String UPDATED_CEP = "BBBBBBBBBB";

    private static final String DEFAULT_CIDADE = "AAAAAAAAAA";
    private static final String UPDATED_CIDADE = "BBBBBBBBBB";

    private static final String DEFAULT_BAIRRO = "AAAAAAAAAA";
    private static final String UPDATED_BAIRRO = "BBBBBBBBBB";

    @Autowired
    private LocalizacaoRepository localizacaoRepository;

    @Autowired
    private LocalizacaoService localizacaoService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLocalizacaoMockMvc;

    private Localizacao localizacao;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Localizacao createEntity(EntityManager em) {
        Localizacao localizacao = new Localizacao()
            .endereco(DEFAULT_ENDERECO)
            .cep(DEFAULT_CEP)
            .cidade(DEFAULT_CIDADE)
            .bairro(DEFAULT_BAIRRO);
        return localizacao;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Localizacao createUpdatedEntity(EntityManager em) {
        Localizacao localizacao = new Localizacao()
            .endereco(UPDATED_ENDERECO)
            .cep(UPDATED_CEP)
            .cidade(UPDATED_CIDADE)
            .bairro(UPDATED_BAIRRO);
        return localizacao;
    }

    @BeforeEach
    public void initTest() {
        localizacao = createEntity(em);
    }

    @Test
    @Transactional
    public void createLocalizacao() throws Exception {
        int databaseSizeBeforeCreate = localizacaoRepository.findAll().size();
        // Create the Localizacao
        restLocalizacaoMockMvc.perform(post("/api/localizacaos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(localizacao)))
            .andExpect(status().isCreated());

        // Validate the Localizacao in the database
        List<Localizacao> localizacaoList = localizacaoRepository.findAll();
        assertThat(localizacaoList).hasSize(databaseSizeBeforeCreate + 1);
        Localizacao testLocalizacao = localizacaoList.get(localizacaoList.size() - 1);
        assertThat(testLocalizacao.getEndereco()).isEqualTo(DEFAULT_ENDERECO);
        assertThat(testLocalizacao.getCep()).isEqualTo(DEFAULT_CEP);
        assertThat(testLocalizacao.getCidade()).isEqualTo(DEFAULT_CIDADE);
        assertThat(testLocalizacao.getBairro()).isEqualTo(DEFAULT_BAIRRO);
    }

    @Test
    @Transactional
    public void createLocalizacaoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = localizacaoRepository.findAll().size();

        // Create the Localizacao with an existing ID
        localizacao.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLocalizacaoMockMvc.perform(post("/api/localizacaos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(localizacao)))
            .andExpect(status().isBadRequest());

        // Validate the Localizacao in the database
        List<Localizacao> localizacaoList = localizacaoRepository.findAll();
        assertThat(localizacaoList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllLocalizacaos() throws Exception {
        // Initialize the database
        localizacaoRepository.saveAndFlush(localizacao);

        // Get all the localizacaoList
        restLocalizacaoMockMvc.perform(get("/api/localizacaos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(localizacao.getId().intValue())))
            .andExpect(jsonPath("$.[*].endereco").value(hasItem(DEFAULT_ENDERECO)))
            .andExpect(jsonPath("$.[*].cep").value(hasItem(DEFAULT_CEP)))
            .andExpect(jsonPath("$.[*].cidade").value(hasItem(DEFAULT_CIDADE)))
            .andExpect(jsonPath("$.[*].bairro").value(hasItem(DEFAULT_BAIRRO)));
    }
    
    @Test
    @Transactional
    public void getLocalizacao() throws Exception {
        // Initialize the database
        localizacaoRepository.saveAndFlush(localizacao);

        // Get the localizacao
        restLocalizacaoMockMvc.perform(get("/api/localizacaos/{id}", localizacao.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(localizacao.getId().intValue()))
            .andExpect(jsonPath("$.endereco").value(DEFAULT_ENDERECO))
            .andExpect(jsonPath("$.cep").value(DEFAULT_CEP))
            .andExpect(jsonPath("$.cidade").value(DEFAULT_CIDADE))
            .andExpect(jsonPath("$.bairro").value(DEFAULT_BAIRRO));
    }
    @Test
    @Transactional
    public void getNonExistingLocalizacao() throws Exception {
        // Get the localizacao
        restLocalizacaoMockMvc.perform(get("/api/localizacaos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLocalizacao() throws Exception {
        // Initialize the database
        localizacaoService.save(localizacao);

        int databaseSizeBeforeUpdate = localizacaoRepository.findAll().size();

        // Update the localizacao
        Localizacao updatedLocalizacao = localizacaoRepository.findById(localizacao.getId()).get();
        // Disconnect from session so that the updates on updatedLocalizacao are not directly saved in db
        em.detach(updatedLocalizacao);
        updatedLocalizacao
            .endereco(UPDATED_ENDERECO)
            .cep(UPDATED_CEP)
            .cidade(UPDATED_CIDADE)
            .bairro(UPDATED_BAIRRO);

        restLocalizacaoMockMvc.perform(put("/api/localizacaos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedLocalizacao)))
            .andExpect(status().isOk());

        // Validate the Localizacao in the database
        List<Localizacao> localizacaoList = localizacaoRepository.findAll();
        assertThat(localizacaoList).hasSize(databaseSizeBeforeUpdate);
        Localizacao testLocalizacao = localizacaoList.get(localizacaoList.size() - 1);
        assertThat(testLocalizacao.getEndereco()).isEqualTo(UPDATED_ENDERECO);
        assertThat(testLocalizacao.getCep()).isEqualTo(UPDATED_CEP);
        assertThat(testLocalizacao.getCidade()).isEqualTo(UPDATED_CIDADE);
        assertThat(testLocalizacao.getBairro()).isEqualTo(UPDATED_BAIRRO);
    }

    @Test
    @Transactional
    public void updateNonExistingLocalizacao() throws Exception {
        int databaseSizeBeforeUpdate = localizacaoRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLocalizacaoMockMvc.perform(put("/api/localizacaos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(localizacao)))
            .andExpect(status().isBadRequest());

        // Validate the Localizacao in the database
        List<Localizacao> localizacaoList = localizacaoRepository.findAll();
        assertThat(localizacaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteLocalizacao() throws Exception {
        // Initialize the database
        localizacaoService.save(localizacao);

        int databaseSizeBeforeDelete = localizacaoRepository.findAll().size();

        // Delete the localizacao
        restLocalizacaoMockMvc.perform(delete("/api/localizacaos/{id}", localizacao.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Localizacao> localizacaoList = localizacaoRepository.findAll();
        assertThat(localizacaoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
