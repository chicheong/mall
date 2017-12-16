package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.CurrencyRate;
import com.wongs.repository.CurrencyRateRepository;
import com.wongs.repository.search.CurrencyRateSearchRepository;
import com.wongs.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.wongs.web.rest.TestUtil.sameInstant;
import static com.wongs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wongs.domain.enumeration.CurrencyType;
import com.wongs.domain.enumeration.CurrencyType;
/**
 * Test class for the CurrencyRateResource REST controller.
 *
 * @see CurrencyRateResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class CurrencyRateResourceIntTest {

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
    private CurrencyRateSearchRepository currencyRateSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCurrencyRateMockMvc;

    private CurrencyRate currencyRate;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CurrencyRateResource currencyRateResource = new CurrencyRateResource(currencyRateRepository, currencyRateSearchRepository);
        this.restCurrencyRateMockMvc = MockMvcBuilders.standaloneSetup(currencyRateResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

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

    @Before
    public void initTest() {
        currencyRateSearchRepository.deleteAll();
        currencyRate = createEntity(em);
    }

    @Test
    @Transactional
    public void createCurrencyRate() throws Exception {
        int databaseSizeBeforeCreate = currencyRateRepository.findAll().size();

        // Create the CurrencyRate
        restCurrencyRateMockMvc.perform(post("/api/currency-rates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(currencyRate)))
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
        CurrencyRate currencyRateEs = currencyRateSearchRepository.findOne(testCurrencyRate.getId());
        assertThat(testCurrencyRate.getFrom()).isEqualTo(testCurrencyRate.getFrom());
        assertThat(testCurrencyRate.getTo()).isEqualTo(testCurrencyRate.getTo());
        assertThat(currencyRateEs).isEqualToIgnoringGivenFields(testCurrencyRate, "from", "to");
    }

    @Test
    @Transactional
    public void createCurrencyRateWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = currencyRateRepository.findAll().size();

        // Create the CurrencyRate with an existing ID
        currencyRate.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCurrencyRateMockMvc.perform(post("/api/currency-rates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(currencyRate)))
            .andExpect(status().isBadRequest());

        // Validate the CurrencyRate in the database
        List<CurrencyRate> currencyRateList = currencyRateRepository.findAll();
        assertThat(currencyRateList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllCurrencyRates() throws Exception {
        // Initialize the database
        currencyRateRepository.saveAndFlush(currencyRate);

        // Get all the currencyRateList
        restCurrencyRateMockMvc.perform(get("/api/currency-rates?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
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
        currencyRateSearchRepository.save(currencyRate);
        int databaseSizeBeforeUpdate = currencyRateRepository.findAll().size();

        // Update the currencyRate
        CurrencyRate updatedCurrencyRate = currencyRateRepository.findOne(currencyRate.getId());
        // Disconnect from session so that the updates on updatedCurrencyRate are not directly saved in db
        em.detach(updatedCurrencyRate);
        updatedCurrencyRate
            .from(UPDATED_FROM)
            .to(UPDATED_TO)
            .rate(UPDATED_RATE)
            .sourceCurrency(UPDATED_SOURCE_CURRENCY)
            .targetCurrency(UPDATED_TARGET_CURRENCY);

        restCurrencyRateMockMvc.perform(put("/api/currency-rates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCurrencyRate)))
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
        CurrencyRate currencyRateEs = currencyRateSearchRepository.findOne(testCurrencyRate.getId());
        assertThat(testCurrencyRate.getFrom()).isEqualTo(testCurrencyRate.getFrom());
        assertThat(testCurrencyRate.getTo()).isEqualTo(testCurrencyRate.getTo());
        assertThat(currencyRateEs).isEqualToIgnoringGivenFields(testCurrencyRate, "from", "to");
    }

    @Test
    @Transactional
    public void updateNonExistingCurrencyRate() throws Exception {
        int databaseSizeBeforeUpdate = currencyRateRepository.findAll().size();

        // Create the CurrencyRate

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCurrencyRateMockMvc.perform(put("/api/currency-rates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(currencyRate)))
            .andExpect(status().isCreated());

        // Validate the CurrencyRate in the database
        List<CurrencyRate> currencyRateList = currencyRateRepository.findAll();
        assertThat(currencyRateList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCurrencyRate() throws Exception {
        // Initialize the database
        currencyRateRepository.saveAndFlush(currencyRate);
        currencyRateSearchRepository.save(currencyRate);
        int databaseSizeBeforeDelete = currencyRateRepository.findAll().size();

        // Get the currencyRate
        restCurrencyRateMockMvc.perform(delete("/api/currency-rates/{id}", currencyRate.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean currencyRateExistsInEs = currencyRateSearchRepository.exists(currencyRate.getId());
        assertThat(currencyRateExistsInEs).isFalse();

        // Validate the database is empty
        List<CurrencyRate> currencyRateList = currencyRateRepository.findAll();
        assertThat(currencyRateList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchCurrencyRate() throws Exception {
        // Initialize the database
        currencyRateRepository.saveAndFlush(currencyRate);
        currencyRateSearchRepository.save(currencyRate);

        // Search the currencyRate
        restCurrencyRateMockMvc.perform(get("/api/_search/currency-rates?query=id:" + currencyRate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(currencyRate.getId().intValue())))
            .andExpect(jsonPath("$.[*].from").value(hasItem(sameInstant(DEFAULT_FROM))))
            .andExpect(jsonPath("$.[*].to").value(hasItem(sameInstant(DEFAULT_TO))))
            .andExpect(jsonPath("$.[*].rate").value(hasItem(DEFAULT_RATE.intValue())))
            .andExpect(jsonPath("$.[*].sourceCurrency").value(hasItem(DEFAULT_SOURCE_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].targetCurrency").value(hasItem(DEFAULT_TARGET_CURRENCY.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CurrencyRate.class);
        CurrencyRate currencyRate1 = new CurrencyRate();
        currencyRate1.setId(1L);
        CurrencyRate currencyRate2 = new CurrencyRate();
        currencyRate2.setId(currencyRate1.getId());
        assertThat(currencyRate1).isEqualTo(currencyRate2);
        currencyRate2.setId(2L);
        assertThat(currencyRate1).isNotEqualTo(currencyRate2);
        currencyRate1.setId(null);
        assertThat(currencyRate1).isNotEqualTo(currencyRate2);
    }
}
