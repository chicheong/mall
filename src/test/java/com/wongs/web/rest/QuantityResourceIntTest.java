package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.Quantity;
import com.wongs.repository.QuantityRepository;
import com.wongs.repository.search.QuantitySearchRepository;
import com.wongs.service.dto.QuantityDTO;
import com.wongs.service.mapper.QuantityMapper;
import com.wongs.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;


import static com.wongs.web.rest.TestUtil.sameInstant;
import static com.wongs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the QuantityResource REST controller.
 *
 * @see QuantityResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class QuantityResourceIntTest {

    private static final ZonedDateTime DEFAULT_FROM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_FROM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_TO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    @Autowired
    private QuantityRepository quantityRepository;

    @Autowired
    private QuantityMapper quantityMapper;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.QuantitySearchRepositoryMockConfiguration
     */
    @Autowired
    private QuantitySearchRepository mockQuantitySearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restQuantityMockMvc;

    private Quantity quantity;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final QuantityResource quantityResource = new QuantityResource(quantityRepository, quantityMapper, mockQuantitySearchRepository);
        this.restQuantityMockMvc = MockMvcBuilders.standaloneSetup(quantityResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Quantity createEntity(EntityManager em) {
        Quantity quantity = new Quantity()
            .from(DEFAULT_FROM)
            .to(DEFAULT_TO)
            .quantity(DEFAULT_QUANTITY);
        return quantity;
    }

    @Before
    public void initTest() {
        quantity = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuantity() throws Exception {
        int databaseSizeBeforeCreate = quantityRepository.findAll().size();

        // Create the Quantity
        QuantityDTO quantityDTO = quantityMapper.toDto(quantity);
        restQuantityMockMvc.perform(post("/api/quantities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(quantityDTO)))
            .andExpect(status().isCreated());

        // Validate the Quantity in the database
        List<Quantity> quantityList = quantityRepository.findAll();
        assertThat(quantityList).hasSize(databaseSizeBeforeCreate + 1);
        Quantity testQuantity = quantityList.get(quantityList.size() - 1);
        assertThat(testQuantity.getFrom()).isEqualTo(DEFAULT_FROM);
        assertThat(testQuantity.getTo()).isEqualTo(DEFAULT_TO);
        assertThat(testQuantity.getQuantity()).isEqualTo(DEFAULT_QUANTITY);

        // Validate the Quantity in Elasticsearch
        verify(mockQuantitySearchRepository, times(1)).save(testQuantity);
    }

    @Test
    @Transactional
    public void createQuantityWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = quantityRepository.findAll().size();

        // Create the Quantity with an existing ID
        quantity.setId(1L);
        QuantityDTO quantityDTO = quantityMapper.toDto(quantity);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuantityMockMvc.perform(post("/api/quantities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(quantityDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Quantity in the database
        List<Quantity> quantityList = quantityRepository.findAll();
        assertThat(quantityList).hasSize(databaseSizeBeforeCreate);

        // Validate the Quantity in Elasticsearch
        verify(mockQuantitySearchRepository, times(0)).save(quantity);
    }

    @Test
    @Transactional
    public void getAllQuantities() throws Exception {
        // Initialize the database
        quantityRepository.saveAndFlush(quantity);

        // Get all the quantityList
        restQuantityMockMvc.perform(get("/api/quantities?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(quantity.getId().intValue())))
            .andExpect(jsonPath("$.[*].from").value(hasItem(sameInstant(DEFAULT_FROM))))
            .andExpect(jsonPath("$.[*].to").value(hasItem(sameInstant(DEFAULT_TO))))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)));
    }
    
    @Test
    @Transactional
    public void getQuantity() throws Exception {
        // Initialize the database
        quantityRepository.saveAndFlush(quantity);

        // Get the quantity
        restQuantityMockMvc.perform(get("/api/quantities/{id}", quantity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(quantity.getId().intValue()))
            .andExpect(jsonPath("$.from").value(sameInstant(DEFAULT_FROM)))
            .andExpect(jsonPath("$.to").value(sameInstant(DEFAULT_TO)))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY));
    }

    @Test
    @Transactional
    public void getNonExistingQuantity() throws Exception {
        // Get the quantity
        restQuantityMockMvc.perform(get("/api/quantities/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuantity() throws Exception {
        // Initialize the database
        quantityRepository.saveAndFlush(quantity);

        int databaseSizeBeforeUpdate = quantityRepository.findAll().size();

        // Update the quantity
        Quantity updatedQuantity = quantityRepository.findById(quantity.getId()).get();
        // Disconnect from session so that the updates on updatedQuantity are not directly saved in db
        em.detach(updatedQuantity);
        updatedQuantity
            .from(UPDATED_FROM)
            .to(UPDATED_TO)
            .quantity(UPDATED_QUANTITY);
        QuantityDTO quantityDTO = quantityMapper.toDto(updatedQuantity);

        restQuantityMockMvc.perform(put("/api/quantities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(quantityDTO)))
            .andExpect(status().isOk());

        // Validate the Quantity in the database
        List<Quantity> quantityList = quantityRepository.findAll();
        assertThat(quantityList).hasSize(databaseSizeBeforeUpdate);
        Quantity testQuantity = quantityList.get(quantityList.size() - 1);
        assertThat(testQuantity.getFrom()).isEqualTo(UPDATED_FROM);
        assertThat(testQuantity.getTo()).isEqualTo(UPDATED_TO);
        assertThat(testQuantity.getQuantity()).isEqualTo(UPDATED_QUANTITY);

        // Validate the Quantity in Elasticsearch
        verify(mockQuantitySearchRepository, times(1)).save(testQuantity);
    }

    @Test
    @Transactional
    public void updateNonExistingQuantity() throws Exception {
        int databaseSizeBeforeUpdate = quantityRepository.findAll().size();

        // Create the Quantity
        QuantityDTO quantityDTO = quantityMapper.toDto(quantity);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuantityMockMvc.perform(put("/api/quantities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(quantityDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Quantity in the database
        List<Quantity> quantityList = quantityRepository.findAll();
        assertThat(quantityList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Quantity in Elasticsearch
        verify(mockQuantitySearchRepository, times(0)).save(quantity);
    }

    @Test
    @Transactional
    public void deleteQuantity() throws Exception {
        // Initialize the database
        quantityRepository.saveAndFlush(quantity);

        int databaseSizeBeforeDelete = quantityRepository.findAll().size();

        // Delete the quantity
        restQuantityMockMvc.perform(delete("/api/quantities/{id}", quantity.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Quantity> quantityList = quantityRepository.findAll();
        assertThat(quantityList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Quantity in Elasticsearch
        verify(mockQuantitySearchRepository, times(1)).deleteById(quantity.getId());
    }

    @Test
    @Transactional
    public void searchQuantity() throws Exception {
        // Initialize the database
        quantityRepository.saveAndFlush(quantity);
        when(mockQuantitySearchRepository.search(queryStringQuery("id:" + quantity.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(quantity), PageRequest.of(0, 1), 1));
        // Search the quantity
        restQuantityMockMvc.perform(get("/api/_search/quantities?query=id:" + quantity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(quantity.getId().intValue())))
            .andExpect(jsonPath("$.[*].from").value(hasItem(sameInstant(DEFAULT_FROM))))
            .andExpect(jsonPath("$.[*].to").value(hasItem(sameInstant(DEFAULT_TO))))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Quantity.class);
        Quantity quantity1 = new Quantity();
        quantity1.setId(1L);
        Quantity quantity2 = new Quantity();
        quantity2.setId(quantity1.getId());
        assertThat(quantity1).isEqualTo(quantity2);
        quantity2.setId(2L);
        assertThat(quantity1).isNotEqualTo(quantity2);
        quantity1.setId(null);
        assertThat(quantity1).isNotEqualTo(quantity2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuantityDTO.class);
        QuantityDTO quantityDTO1 = new QuantityDTO();
        quantityDTO1.setId(1L);
        QuantityDTO quantityDTO2 = new QuantityDTO();
        assertThat(quantityDTO1).isNotEqualTo(quantityDTO2);
        quantityDTO2.setId(quantityDTO1.getId());
        assertThat(quantityDTO1).isEqualTo(quantityDTO2);
        quantityDTO2.setId(2L);
        assertThat(quantityDTO1).isNotEqualTo(quantityDTO2);
        quantityDTO1.setId(null);
        assertThat(quantityDTO1).isNotEqualTo(quantityDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(quantityMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(quantityMapper.fromId(null)).isNull();
    }
}
