package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.ShippingStatusHistory;
import com.wongs.repository.ShippingStatusHistoryRepository;
import com.wongs.repository.search.ShippingStatusHistorySearchRepository;
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

import com.wongs.domain.enumeration.ShippingStatus;
/**
 * Test class for the ShippingStatusHistoryResource REST controller.
 *
 * @see ShippingStatusHistoryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class ShippingStatusHistoryResourceIntTest {

    private static final ZonedDateTime DEFAULT_EFFECTIVE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_EFFECTIVE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ShippingStatus DEFAULT_STATUS = ShippingStatus.PENDING;
    private static final ShippingStatus UPDATED_STATUS = ShippingStatus.SHIPPED;

    @Autowired
    private ShippingStatusHistoryRepository shippingStatusHistoryRepository;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.ShippingStatusHistorySearchRepositoryMockConfiguration
     */
    @Autowired
    private ShippingStatusHistorySearchRepository mockShippingStatusHistorySearchRepository;

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

    private MockMvc restShippingStatusHistoryMockMvc;

    private ShippingStatusHistory shippingStatusHistory;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ShippingStatusHistoryResource shippingStatusHistoryResource = new ShippingStatusHistoryResource(shippingStatusHistoryRepository, mockShippingStatusHistorySearchRepository);
        this.restShippingStatusHistoryMockMvc = MockMvcBuilders.standaloneSetup(shippingStatusHistoryResource)
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
    public static ShippingStatusHistory createEntity(EntityManager em) {
        ShippingStatusHistory shippingStatusHistory = new ShippingStatusHistory()
            .effectiveDate(DEFAULT_EFFECTIVE_DATE)
            .status(DEFAULT_STATUS);
        return shippingStatusHistory;
    }

    @Before
    public void initTest() {
        shippingStatusHistory = createEntity(em);
    }

    @Test
    @Transactional
    public void createShippingStatusHistory() throws Exception {
        int databaseSizeBeforeCreate = shippingStatusHistoryRepository.findAll().size();

        // Create the ShippingStatusHistory
        restShippingStatusHistoryMockMvc.perform(post("/api/shipping-status-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shippingStatusHistory)))
            .andExpect(status().isCreated());

        // Validate the ShippingStatusHistory in the database
        List<ShippingStatusHistory> shippingStatusHistoryList = shippingStatusHistoryRepository.findAll();
        assertThat(shippingStatusHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        ShippingStatusHistory testShippingStatusHistory = shippingStatusHistoryList.get(shippingStatusHistoryList.size() - 1);
        assertThat(testShippingStatusHistory.getEffectiveDate()).isEqualTo(DEFAULT_EFFECTIVE_DATE);
        assertThat(testShippingStatusHistory.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the ShippingStatusHistory in Elasticsearch
        verify(mockShippingStatusHistorySearchRepository, times(1)).save(testShippingStatusHistory);
    }

    @Test
    @Transactional
    public void createShippingStatusHistoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = shippingStatusHistoryRepository.findAll().size();

        // Create the ShippingStatusHistory with an existing ID
        shippingStatusHistory.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restShippingStatusHistoryMockMvc.perform(post("/api/shipping-status-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shippingStatusHistory)))
            .andExpect(status().isBadRequest());

        // Validate the ShippingStatusHistory in the database
        List<ShippingStatusHistory> shippingStatusHistoryList = shippingStatusHistoryRepository.findAll();
        assertThat(shippingStatusHistoryList).hasSize(databaseSizeBeforeCreate);

        // Validate the ShippingStatusHistory in Elasticsearch
        verify(mockShippingStatusHistorySearchRepository, times(0)).save(shippingStatusHistory);
    }

    @Test
    @Transactional
    public void getAllShippingStatusHistories() throws Exception {
        // Initialize the database
        shippingStatusHistoryRepository.saveAndFlush(shippingStatusHistory);

        // Get all the shippingStatusHistoryList
        restShippingStatusHistoryMockMvc.perform(get("/api/shipping-status-histories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shippingStatusHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].effectiveDate").value(hasItem(sameInstant(DEFAULT_EFFECTIVE_DATE))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
    
    @Test
    @Transactional
    public void getShippingStatusHistory() throws Exception {
        // Initialize the database
        shippingStatusHistoryRepository.saveAndFlush(shippingStatusHistory);

        // Get the shippingStatusHistory
        restShippingStatusHistoryMockMvc.perform(get("/api/shipping-status-histories/{id}", shippingStatusHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(shippingStatusHistory.getId().intValue()))
            .andExpect(jsonPath("$.effectiveDate").value(sameInstant(DEFAULT_EFFECTIVE_DATE)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingShippingStatusHistory() throws Exception {
        // Get the shippingStatusHistory
        restShippingStatusHistoryMockMvc.perform(get("/api/shipping-status-histories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateShippingStatusHistory() throws Exception {
        // Initialize the database
        shippingStatusHistoryRepository.saveAndFlush(shippingStatusHistory);

        int databaseSizeBeforeUpdate = shippingStatusHistoryRepository.findAll().size();

        // Update the shippingStatusHistory
        ShippingStatusHistory updatedShippingStatusHistory = shippingStatusHistoryRepository.findById(shippingStatusHistory.getId()).get();
        // Disconnect from session so that the updates on updatedShippingStatusHistory are not directly saved in db
        em.detach(updatedShippingStatusHistory);
        updatedShippingStatusHistory
            .effectiveDate(UPDATED_EFFECTIVE_DATE)
            .status(UPDATED_STATUS);

        restShippingStatusHistoryMockMvc.perform(put("/api/shipping-status-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedShippingStatusHistory)))
            .andExpect(status().isOk());

        // Validate the ShippingStatusHistory in the database
        List<ShippingStatusHistory> shippingStatusHistoryList = shippingStatusHistoryRepository.findAll();
        assertThat(shippingStatusHistoryList).hasSize(databaseSizeBeforeUpdate);
        ShippingStatusHistory testShippingStatusHistory = shippingStatusHistoryList.get(shippingStatusHistoryList.size() - 1);
        assertThat(testShippingStatusHistory.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
        assertThat(testShippingStatusHistory.getStatus()).isEqualTo(UPDATED_STATUS);

        // Validate the ShippingStatusHistory in Elasticsearch
        verify(mockShippingStatusHistorySearchRepository, times(1)).save(testShippingStatusHistory);
    }

    @Test
    @Transactional
    public void updateNonExistingShippingStatusHistory() throws Exception {
        int databaseSizeBeforeUpdate = shippingStatusHistoryRepository.findAll().size();

        // Create the ShippingStatusHistory

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShippingStatusHistoryMockMvc.perform(put("/api/shipping-status-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shippingStatusHistory)))
            .andExpect(status().isBadRequest());

        // Validate the ShippingStatusHistory in the database
        List<ShippingStatusHistory> shippingStatusHistoryList = shippingStatusHistoryRepository.findAll();
        assertThat(shippingStatusHistoryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ShippingStatusHistory in Elasticsearch
        verify(mockShippingStatusHistorySearchRepository, times(0)).save(shippingStatusHistory);
    }

    @Test
    @Transactional
    public void deleteShippingStatusHistory() throws Exception {
        // Initialize the database
        shippingStatusHistoryRepository.saveAndFlush(shippingStatusHistory);

        int databaseSizeBeforeDelete = shippingStatusHistoryRepository.findAll().size();

        // Delete the shippingStatusHistory
        restShippingStatusHistoryMockMvc.perform(delete("/api/shipping-status-histories/{id}", shippingStatusHistory.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ShippingStatusHistory> shippingStatusHistoryList = shippingStatusHistoryRepository.findAll();
        assertThat(shippingStatusHistoryList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ShippingStatusHistory in Elasticsearch
        verify(mockShippingStatusHistorySearchRepository, times(1)).deleteById(shippingStatusHistory.getId());
    }

    @Test
    @Transactional
    public void searchShippingStatusHistory() throws Exception {
        // Initialize the database
        shippingStatusHistoryRepository.saveAndFlush(shippingStatusHistory);
        when(mockShippingStatusHistorySearchRepository.search(queryStringQuery("id:" + shippingStatusHistory.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(shippingStatusHistory), PageRequest.of(0, 1), 1));
        // Search the shippingStatusHistory
        restShippingStatusHistoryMockMvc.perform(get("/api/_search/shipping-status-histories?query=id:" + shippingStatusHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shippingStatusHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].effectiveDate").value(hasItem(sameInstant(DEFAULT_EFFECTIVE_DATE))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShippingStatusHistory.class);
        ShippingStatusHistory shippingStatusHistory1 = new ShippingStatusHistory();
        shippingStatusHistory1.setId(1L);
        ShippingStatusHistory shippingStatusHistory2 = new ShippingStatusHistory();
        shippingStatusHistory2.setId(shippingStatusHistory1.getId());
        assertThat(shippingStatusHistory1).isEqualTo(shippingStatusHistory2);
        shippingStatusHistory2.setId(2L);
        assertThat(shippingStatusHistory1).isNotEqualTo(shippingStatusHistory2);
        shippingStatusHistory1.setId(null);
        assertThat(shippingStatusHistory1).isNotEqualTo(shippingStatusHistory2);
    }
}
