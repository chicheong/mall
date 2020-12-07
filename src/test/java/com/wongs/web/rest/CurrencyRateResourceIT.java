package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.CurrencyRate;
import com.wongs.repository.CurrencyRateRepository;
import com.wongs.repository.search.CurrencyRateSearchRepository;
import com.wongs.service.CurrencyRateService;
import com.wongs.service.dto.CurrencyRateDTO;
import com.wongs.service.mapper.CurrencyRateMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

import static com.wongs.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wongs.domain.enumeration.CurrencyType;
import com.wongs.domain.enumeration.CurrencyType;
/**
 * Integration tests for the {@link CurrencyRateResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class CurrencyRateResourceIT {

    private static final ZonedDateTime DEFAULT_FROM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_FROM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_TO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final BigDecimal DEFAULT_RATE = new BigDecimal(1);
    private static final BigDecimal UPDATED_RATE = new BigDecimal(2);

    private static final CurrencyType DEFAULT_SOURCE_CURRENCY = CurrencyType.HKD;
    private static final CurrencyType UPDATED_SOURCE_CURRENCY = CurrencyType.CNY;

    private static final CurrencyType DEFAULT_TARGET_CURRENCY = CurrencyType.HKD;
    private static final CurrencyType UPDATED_TARGET_CURRENCY = CurrencyType.CNY;

    @Autowired
    private CurrencyRateRepository currencyRateRepository;

    @Autowired
    private CurrencyRateMapper currencyRateMapper;

    @Autowired
    private CurrencyRateService currencyRateService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.CurrencyRateSearchRepositoryMockConfiguration
     */
    @Autowired
    private CurrencyRateSearchRepository mockCurrencyRateSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCurrencyRateMockMvc;

    private CurrencyRate currencyRate;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CurrencyRate createEntity(EntityManager em) {
        CurrencyRate currencyRate = new CurrencyRate()
            .from(DEFAULT_FROM)
            .to(DEFAULT_TO)
            .rate(DEFAULT_RATE)
            .sourceCurrency(DEFAULT_SOURCE_CURRENCY)
            .targetCurrency(DEFAULT_TARGET_CURRENCY);
        return currencyRate;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CurrencyRate createUpdatedEntity(EntityManager em) {
        CurrencyRate currencyRate = new CurrencyRate()
            .from(UPDATED_FROM)
            .to(UPDATED_TO)
            .rate(UPDATED_RATE)
            .sourceCurrency(UPDATED_SOURCE_CURRENCY)
            .targetCurrency(UPDATED_TARGET_CURRENCY);
        return currencyRate;
    }

    @BeforeEach
    public void initTest() {
        currencyRate = createEntity(em);
    }

    @Test
    @Transactional
    public void createCurrencyRate() throws Exception {
        int databaseSizeBeforeCreate = currencyRateRepository.findAll().size();

        // Create the CurrencyRate
        CurrencyRateDTO currencyRateDTO = currencyRateMapper.toDto(currencyRate);
        restCurrencyRateMockMvc.perform(post("/api/currency-rates")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(currencyRateDTO)))
            .andExpect(status().isCreated());

        // Validate the CurrencyRate in the database
        List<CurrencyRate> currencyRateList = currencyRateRepository.findAll();
        assertThat(currencyRateList).hasSize(databaseSizeBeforeCreate + 1);
        CurrencyRate testCurrencyRate = currencyRateList.get(currencyRateList.size() - 1);
        assertThat(testCurrencyRate.getFrom()).isEqualTo(DEFAULT_FROM);
        assertThat(testCurrencyRate.getTo()).isEqualTo(DEFAULT_TO);
        assertThat(testCurrencyRate.getRate()).isEqualTo(DEFAULT_RATE);
        assertThat(testCurrencyRate.getSourceCurrency()).isEqualTo(DEFAULT_SOURCE_CURRENCY);
        assertThat(testCurrencyRate.getTargetCurrency()).isEqualTo(DEFAULT_TARGET_CURRENCY);

        // Validate the CurrencyRate in Elasticsearch
        verify(mockCurrencyRateSearchRepository, times(1)).save(testCurrencyRate);
    }

    @Test
    @Transactional
    public void createCurrencyRateWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = currencyRateRepository.findAll().size();

        // Create the CurrencyRate with an existing ID
        currencyRate.setId(1L);
        CurrencyRateDTO currencyRateDTO = currencyRateMapper.toDto(currencyRate);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCurrencyRateMockMvc.perform(post("/api/currency-rates")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(currencyRateDTO)))
            .andExpect(status().isBadRequest());

        // Validate the CurrencyRate in the database
        List<CurrencyRate> currencyRateList = currencyRateRepository.findAll();
        assertThat(currencyRateList).hasSize(databaseSizeBeforeCreate);

        // Validate the CurrencyRate in Elasticsearch
        verify(mockCurrencyRateSearchRepository, times(0)).save(currencyRate);
    }


    @Test
    @Transactional
    public void getAllCurrencyRates() throws Exception {
        // Initialize the database
        currencyRateRepository.saveAndFlush(currencyRate);

        // Get all the currencyRateList
        restCurrencyRateMockMvc.perform(get("/api/currency-rates?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(currencyRate.getId().intValue())))
            .andExpect(jsonPath("$.[*].from").value(hasItem(sameInstant(DEFAULT_FROM))))
            .andExpect(jsonPath("$.[*].to").value(hasItem(sameInstant(DEFAULT_TO))))
            .andExpect(jsonPath("$.[*].rate").value(hasItem(DEFAULT_RATE.intValue())))
            .andExpect(jsonPath("$.[*].sourceCurrency").value(hasItem(DEFAULT_SOURCE_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].targetCurrency").value(hasItem(DEFAULT_TARGET_CURRENCY.toString())));
    }
    
    @Test
    @Transactional
    public void getCurrencyRate() throws Exception {
        // Initialize the database
        currencyRateRepository.saveAndFlush(currencyRate);

        // Get the currencyRate
        restCurrencyRateMockMvc.perform(get("/api/currency-rates/{id}", currencyRate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(currencyRate.getId().intValue()))
            .andExpect(jsonPath("$.from").value(sameInstant(DEFAULT_FROM)))
            .andExpect(jsonPath("$.to").value(sameInstant(DEFAULT_TO)))
            .andExpect(jsonPath("$.rate").value(DEFAULT_RATE.intValue()))
            .andExpect(jsonPath("$.sourceCurrency").value(DEFAULT_SOURCE_CURRENCY.toString()))
            .andExpect(jsonPath("$.targetCurrency").value(DEFAULT_TARGET_CURRENCY.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCurrencyRate() throws Exception {
        // Get the currencyRate
        restCurrencyRateMockMvc.perform(get("/api/currency-rates/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCurrencyRate() throws Exception {
        // Initialize the database
        currencyRateRepository.saveAndFlush(currencyRate);

        int databaseSizeBeforeUpdate = currencyRateRepository.findAll().size();

        // Update the currencyRate
        CurrencyRate updatedCurrencyRate = currencyRateRepository.findById(currencyRate.getId()).get();
        // Disconnect from session so that the updates on updatedCurrencyRate are not directly saved in db
        em.detach(updatedCurrencyRate);
        updatedCurrencyRate
            .from(UPDATED_FROM)
            .to(UPDATED_TO)
            .rate(UPDATED_RATE)
            .sourceCurrency(UPDATED_SOURCE_CURRENCY)
            .targetCurrency(UPDATED_TARGET_CURRENCY);
        CurrencyRateDTO currencyRateDTO = currencyRateMapper.toDto(updatedCurrencyRate);

        restCurrencyRateMockMvc.perform(put("/api/currency-rates")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(currencyRateDTO)))
            .andExpect(status().isOk());

        // Validate the CurrencyRate in the database
        List<CurrencyRate> currencyRateList = currencyRateRepository.findAll();
        assertThat(currencyRateList).hasSize(databaseSizeBeforeUpdate);
        CurrencyRate testCurrencyRate = currencyRateList.get(currencyRateList.size() - 1);
        assertThat(testCurrencyRate.getFrom()).isEqualTo(UPDATED_FROM);
        assertThat(testCurrencyRate.getTo()).isEqualTo(UPDATED_TO);
        assertThat(testCurrencyRate.getRate()).isEqualTo(UPDATED_RATE);
        assertThat(testCurrencyRate.getSourceCurrency()).isEqualTo(UPDATED_SOURCE_CURRENCY);
        assertThat(testCurrencyRate.getTargetCurrency()).isEqualTo(UPDATED_TARGET_CURRENCY);

        // Validate the CurrencyRate in Elasticsearch
        verify(mockCurrencyRateSearchRepository, times(1)).save(testCurrencyRate);
    }

    @Test
    @Transactional
    public void updateNonExistingCurrencyRate() throws Exception {
        int databaseSizeBeforeUpdate = currencyRateRepository.findAll().size();

        // Create the CurrencyRate
        CurrencyRateDTO currencyRateDTO = currencyRateMapper.toDto(currencyRate);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCurrencyRateMockMvc.perform(put("/api/currency-rates")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(currencyRateDTO)))
            .andExpect(status().isBadRequest());

        // Validate the CurrencyRate in the database
        List<CurrencyRate> currencyRateList = currencyRateRepository.findAll();
        assertThat(currencyRateList).hasSize(databaseSizeBeforeUpdate);

        // Validate the CurrencyRate in Elasticsearch
        verify(mockCurrencyRateSearchRepository, times(0)).save(currencyRate);
    }

    @Test
    @Transactional
    public void deleteCurrencyRate() throws Exception {
        // Initialize the database
        currencyRateRepository.saveAndFlush(currencyRate);

        int databaseSizeBeforeDelete = currencyRateRepository.findAll().size();

        // Delete the currencyRate
        restCurrencyRateMockMvc.perform(delete("/api/currency-rates/{id}", currencyRate.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CurrencyRate> currencyRateList = currencyRateRepository.findAll();
        assertThat(currencyRateList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the CurrencyRate in Elasticsearch
        verify(mockCurrencyRateSearchRepository, times(1)).deleteById(currencyRate.getId());
    }

    @Test
    @Transactional
    public void searchCurrencyRate() throws Exception {
        // Initialize the database
        currencyRateRepository.saveAndFlush(currencyRate);
        when(mockCurrencyRateSearchRepository.search(queryStringQuery("id:" + currencyRate.getId())))
            .thenReturn(Collections.singletonList(currencyRate));
        // Search the currencyRate
        restCurrencyRateMockMvc.perform(get("/api/_search/currency-rates?query=id:" + currencyRate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(currencyRate.getId().intValue())))
            .andExpect(jsonPath("$.[*].from").value(hasItem(sameInstant(DEFAULT_FROM))))
            .andExpect(jsonPath("$.[*].to").value(hasItem(sameInstant(DEFAULT_TO))))
            .andExpect(jsonPath("$.[*].rate").value(hasItem(DEFAULT_RATE.intValue())))
            .andExpect(jsonPath("$.[*].sourceCurrency").value(hasItem(DEFAULT_SOURCE_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].targetCurrency").value(hasItem(DEFAULT_TARGET_CURRENCY.toString())));
    }
}
