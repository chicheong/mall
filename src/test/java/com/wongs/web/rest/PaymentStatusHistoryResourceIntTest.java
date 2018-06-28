package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.PaymentStatusHistory;
import com.wongs.repository.PaymentStatusHistoryRepository;
import com.wongs.repository.search.PaymentStatusHistorySearchRepository;
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

import com.wongs.domain.enumeration.PaymentStatus;
/**
 * Test class for the PaymentStatusHistoryResource REST controller.
 *
 * @see PaymentStatusHistoryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class PaymentStatusHistoryResourceIntTest {

    private static final ZonedDateTime DEFAULT_EFFECTIVE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_EFFECTIVE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final PaymentStatus DEFAULT_STATUS = PaymentStatus.PENDING;
    private static final PaymentStatus UPDATED_STATUS = PaymentStatus.PAID;

    @Autowired
    private PaymentStatusHistoryRepository paymentStatusHistoryRepository;

    @Autowired
    private PaymentStatusHistorySearchRepository paymentStatusHistorySearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPaymentStatusHistoryMockMvc;

    private PaymentStatusHistory paymentStatusHistory;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PaymentStatusHistoryResource paymentStatusHistoryResource = new PaymentStatusHistoryResource(paymentStatusHistoryRepository, paymentStatusHistorySearchRepository);
        this.restPaymentStatusHistoryMockMvc = MockMvcBuilders.standaloneSetup(paymentStatusHistoryResource)
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
    public static PaymentStatusHistory createEntity(EntityManager em) {
        PaymentStatusHistory paymentStatusHistory = new PaymentStatusHistory()
            .effectiveDate(DEFAULT_EFFECTIVE_DATE)
            .status(DEFAULT_STATUS);
        return paymentStatusHistory;
    }

    @Before
    public void initTest() {
        paymentStatusHistorySearchRepository.deleteAll();
        paymentStatusHistory = createEntity(em);
    }

    @Test
    @Transactional
    public void createPaymentStatusHistory() throws Exception {
        int databaseSizeBeforeCreate = paymentStatusHistoryRepository.findAll().size();

        // Create the PaymentStatusHistory
        restPaymentStatusHistoryMockMvc.perform(post("/api/payment-status-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentStatusHistory)))
            .andExpect(status().isCreated());

        // Validate the PaymentStatusHistory in the database
        List<PaymentStatusHistory> paymentStatusHistoryList = paymentStatusHistoryRepository.findAll();
        assertThat(paymentStatusHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        PaymentStatusHistory testPaymentStatusHistory = paymentStatusHistoryList.get(paymentStatusHistoryList.size() - 1);
        assertThat(testPaymentStatusHistory.getEffectiveDate()).isEqualTo(DEFAULT_EFFECTIVE_DATE);
        assertThat(testPaymentStatusHistory.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the PaymentStatusHistory in Elasticsearch
        PaymentStatusHistory paymentStatusHistoryEs = paymentStatusHistorySearchRepository.findOne(testPaymentStatusHistory.getId());
        assertThat(testPaymentStatusHistory.getEffectiveDate()).isEqualTo(testPaymentStatusHistory.getEffectiveDate());
        assertThat(paymentStatusHistoryEs).isEqualToIgnoringGivenFields(testPaymentStatusHistory, "effectiveDate");
    }

    @Test
    @Transactional
    public void createPaymentStatusHistoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = paymentStatusHistoryRepository.findAll().size();

        // Create the PaymentStatusHistory with an existing ID
        paymentStatusHistory.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaymentStatusHistoryMockMvc.perform(post("/api/payment-status-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentStatusHistory)))
            .andExpect(status().isBadRequest());

        // Validate the PaymentStatusHistory in the database
        List<PaymentStatusHistory> paymentStatusHistoryList = paymentStatusHistoryRepository.findAll();
        assertThat(paymentStatusHistoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllPaymentStatusHistories() throws Exception {
        // Initialize the database
        paymentStatusHistoryRepository.saveAndFlush(paymentStatusHistory);

        // Get all the paymentStatusHistoryList
        restPaymentStatusHistoryMockMvc.perform(get("/api/payment-status-histories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentStatusHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].effectiveDate").value(hasItem(sameInstant(DEFAULT_EFFECTIVE_DATE))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    public void getPaymentStatusHistory() throws Exception {
        // Initialize the database
        paymentStatusHistoryRepository.saveAndFlush(paymentStatusHistory);

        // Get the paymentStatusHistory
        restPaymentStatusHistoryMockMvc.perform(get("/api/payment-status-histories/{id}", paymentStatusHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(paymentStatusHistory.getId().intValue()))
            .andExpect(jsonPath("$.effectiveDate").value(sameInstant(DEFAULT_EFFECTIVE_DATE)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPaymentStatusHistory() throws Exception {
        // Get the paymentStatusHistory
        restPaymentStatusHistoryMockMvc.perform(get("/api/payment-status-histories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePaymentStatusHistory() throws Exception {
        // Initialize the database
        paymentStatusHistoryRepository.saveAndFlush(paymentStatusHistory);
        paymentStatusHistorySearchRepository.save(paymentStatusHistory);
        int databaseSizeBeforeUpdate = paymentStatusHistoryRepository.findAll().size();

        // Update the paymentStatusHistory
        PaymentStatusHistory updatedPaymentStatusHistory = paymentStatusHistoryRepository.findOne(paymentStatusHistory.getId());
        // Disconnect from session so that the updates on updatedPaymentStatusHistory are not directly saved in db
        em.detach(updatedPaymentStatusHistory);
        updatedPaymentStatusHistory
            .effectiveDate(UPDATED_EFFECTIVE_DATE)
            .status(UPDATED_STATUS);

        restPaymentStatusHistoryMockMvc.perform(put("/api/payment-status-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPaymentStatusHistory)))
            .andExpect(status().isOk());

        // Validate the PaymentStatusHistory in the database
        List<PaymentStatusHistory> paymentStatusHistoryList = paymentStatusHistoryRepository.findAll();
        assertThat(paymentStatusHistoryList).hasSize(databaseSizeBeforeUpdate);
        PaymentStatusHistory testPaymentStatusHistory = paymentStatusHistoryList.get(paymentStatusHistoryList.size() - 1);
        assertThat(testPaymentStatusHistory.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
        assertThat(testPaymentStatusHistory.getStatus()).isEqualTo(UPDATED_STATUS);

        // Validate the PaymentStatusHistory in Elasticsearch
        PaymentStatusHistory paymentStatusHistoryEs = paymentStatusHistorySearchRepository.findOne(testPaymentStatusHistory.getId());
        assertThat(testPaymentStatusHistory.getEffectiveDate()).isEqualTo(testPaymentStatusHistory.getEffectiveDate());
        assertThat(paymentStatusHistoryEs).isEqualToIgnoringGivenFields(testPaymentStatusHistory, "effectiveDate");
    }

    @Test
    @Transactional
    public void updateNonExistingPaymentStatusHistory() throws Exception {
        int databaseSizeBeforeUpdate = paymentStatusHistoryRepository.findAll().size();

        // Create the PaymentStatusHistory

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPaymentStatusHistoryMockMvc.perform(put("/api/payment-status-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentStatusHistory)))
            .andExpect(status().isCreated());

        // Validate the PaymentStatusHistory in the database
        List<PaymentStatusHistory> paymentStatusHistoryList = paymentStatusHistoryRepository.findAll();
        assertThat(paymentStatusHistoryList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePaymentStatusHistory() throws Exception {
        // Initialize the database
        paymentStatusHistoryRepository.saveAndFlush(paymentStatusHistory);
        paymentStatusHistorySearchRepository.save(paymentStatusHistory);
        int databaseSizeBeforeDelete = paymentStatusHistoryRepository.findAll().size();

        // Get the paymentStatusHistory
        restPaymentStatusHistoryMockMvc.perform(delete("/api/payment-status-histories/{id}", paymentStatusHistory.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean paymentStatusHistoryExistsInEs = paymentStatusHistorySearchRepository.exists(paymentStatusHistory.getId());
        assertThat(paymentStatusHistoryExistsInEs).isFalse();

        // Validate the database is empty
        List<PaymentStatusHistory> paymentStatusHistoryList = paymentStatusHistoryRepository.findAll();
        assertThat(paymentStatusHistoryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPaymentStatusHistory() throws Exception {
        // Initialize the database
        paymentStatusHistoryRepository.saveAndFlush(paymentStatusHistory);
        paymentStatusHistorySearchRepository.save(paymentStatusHistory);

        // Search the paymentStatusHistory
        restPaymentStatusHistoryMockMvc.perform(get("/api/_search/payment-status-histories?query=id:" + paymentStatusHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentStatusHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].effectiveDate").value(hasItem(sameInstant(DEFAULT_EFFECTIVE_DATE))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PaymentStatusHistory.class);
        PaymentStatusHistory paymentStatusHistory1 = new PaymentStatusHistory();
        paymentStatusHistory1.setId(1L);
        PaymentStatusHistory paymentStatusHistory2 = new PaymentStatusHistory();
        paymentStatusHistory2.setId(paymentStatusHistory1.getId());
        assertThat(paymentStatusHistory1).isEqualTo(paymentStatusHistory2);
        paymentStatusHistory2.setId(2L);
        assertThat(paymentStatusHistory1).isNotEqualTo(paymentStatusHistory2);
        paymentStatusHistory1.setId(null);
        assertThat(paymentStatusHistory1).isNotEqualTo(paymentStatusHistory2);
    }
}
