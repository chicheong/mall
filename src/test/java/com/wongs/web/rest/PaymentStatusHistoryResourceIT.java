package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.PaymentStatusHistory;
import com.wongs.repository.PaymentStatusHistoryRepository;
import com.wongs.repository.search.PaymentStatusHistorySearchRepository;
import com.wongs.service.PaymentStatusHistoryService;
import com.wongs.service.dto.PaymentStatusHistoryDTO;
import com.wongs.service.mapper.PaymentStatusHistoryMapper;

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

import com.wongs.domain.enumeration.PaymentStatus;
/**
 * Integration tests for the {@link PaymentStatusHistoryResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class PaymentStatusHistoryResourceIT {

    private static final ZonedDateTime DEFAULT_EFFECTIVE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_EFFECTIVE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final PaymentStatus DEFAULT_STATUS = PaymentStatus.PENDING;
    private static final PaymentStatus UPDATED_STATUS = PaymentStatus.PAID;

    @Autowired
    private PaymentStatusHistoryRepository paymentStatusHistoryRepository;

    @Autowired
    private PaymentStatusHistoryMapper paymentStatusHistoryMapper;

    @Autowired
    private PaymentStatusHistoryService paymentStatusHistoryService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.PaymentStatusHistorySearchRepositoryMockConfiguration
     */
    @Autowired
    private PaymentStatusHistorySearchRepository mockPaymentStatusHistorySearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPaymentStatusHistoryMockMvc;

    private PaymentStatusHistory paymentStatusHistory;

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
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PaymentStatusHistory createUpdatedEntity(EntityManager em) {
        PaymentStatusHistory paymentStatusHistory = new PaymentStatusHistory()
            .effectiveDate(UPDATED_EFFECTIVE_DATE)
            .status(UPDATED_STATUS);
        return paymentStatusHistory;
    }

    @BeforeEach
    public void initTest() {
        paymentStatusHistory = createEntity(em);
    }

    @Test
    @Transactional
    public void createPaymentStatusHistory() throws Exception {
        int databaseSizeBeforeCreate = paymentStatusHistoryRepository.findAll().size();

        // Create the PaymentStatusHistory
        PaymentStatusHistoryDTO paymentStatusHistoryDTO = paymentStatusHistoryMapper.toDto(paymentStatusHistory);
        restPaymentStatusHistoryMockMvc.perform(post("/api/payment-status-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(paymentStatusHistoryDTO)))
            .andExpect(status().isCreated());

        // Validate the PaymentStatusHistory in the database
        List<PaymentStatusHistory> paymentStatusHistoryList = paymentStatusHistoryRepository.findAll();
        assertThat(paymentStatusHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        PaymentStatusHistory testPaymentStatusHistory = paymentStatusHistoryList.get(paymentStatusHistoryList.size() - 1);
        assertThat(testPaymentStatusHistory.getEffectiveDate()).isEqualTo(DEFAULT_EFFECTIVE_DATE);
        assertThat(testPaymentStatusHistory.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the PaymentStatusHistory in Elasticsearch
        verify(mockPaymentStatusHistorySearchRepository, times(1)).save(testPaymentStatusHistory);
    }

    @Test
    @Transactional
    public void createPaymentStatusHistoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = paymentStatusHistoryRepository.findAll().size();

        // Create the PaymentStatusHistory with an existing ID
        paymentStatusHistory.setId(1L);
        PaymentStatusHistoryDTO paymentStatusHistoryDTO = paymentStatusHistoryMapper.toDto(paymentStatusHistory);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaymentStatusHistoryMockMvc.perform(post("/api/payment-status-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(paymentStatusHistoryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the PaymentStatusHistory in the database
        List<PaymentStatusHistory> paymentStatusHistoryList = paymentStatusHistoryRepository.findAll();
        assertThat(paymentStatusHistoryList).hasSize(databaseSizeBeforeCreate);

        // Validate the PaymentStatusHistory in Elasticsearch
        verify(mockPaymentStatusHistorySearchRepository, times(0)).save(paymentStatusHistory);
    }


    @Test
    @Transactional
    public void getAllPaymentStatusHistories() throws Exception {
        // Initialize the database
        paymentStatusHistoryRepository.saveAndFlush(paymentStatusHistory);

        // Get all the paymentStatusHistoryList
        restPaymentStatusHistoryMockMvc.perform(get("/api/payment-status-histories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
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

        int databaseSizeBeforeUpdate = paymentStatusHistoryRepository.findAll().size();

        // Update the paymentStatusHistory
        PaymentStatusHistory updatedPaymentStatusHistory = paymentStatusHistoryRepository.findById(paymentStatusHistory.getId()).get();
        // Disconnect from session so that the updates on updatedPaymentStatusHistory are not directly saved in db
        em.detach(updatedPaymentStatusHistory);
        updatedPaymentStatusHistory
            .effectiveDate(UPDATED_EFFECTIVE_DATE)
            .status(UPDATED_STATUS);
        PaymentStatusHistoryDTO paymentStatusHistoryDTO = paymentStatusHistoryMapper.toDto(updatedPaymentStatusHistory);

        restPaymentStatusHistoryMockMvc.perform(put("/api/payment-status-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(paymentStatusHistoryDTO)))
            .andExpect(status().isOk());

        // Validate the PaymentStatusHistory in the database
        List<PaymentStatusHistory> paymentStatusHistoryList = paymentStatusHistoryRepository.findAll();
        assertThat(paymentStatusHistoryList).hasSize(databaseSizeBeforeUpdate);
        PaymentStatusHistory testPaymentStatusHistory = paymentStatusHistoryList.get(paymentStatusHistoryList.size() - 1);
        assertThat(testPaymentStatusHistory.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
        assertThat(testPaymentStatusHistory.getStatus()).isEqualTo(UPDATED_STATUS);

        // Validate the PaymentStatusHistory in Elasticsearch
        verify(mockPaymentStatusHistorySearchRepository, times(1)).save(testPaymentStatusHistory);
    }

    @Test
    @Transactional
    public void updateNonExistingPaymentStatusHistory() throws Exception {
        int databaseSizeBeforeUpdate = paymentStatusHistoryRepository.findAll().size();

        // Create the PaymentStatusHistory
        PaymentStatusHistoryDTO paymentStatusHistoryDTO = paymentStatusHistoryMapper.toDto(paymentStatusHistory);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaymentStatusHistoryMockMvc.perform(put("/api/payment-status-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(paymentStatusHistoryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the PaymentStatusHistory in the database
        List<PaymentStatusHistory> paymentStatusHistoryList = paymentStatusHistoryRepository.findAll();
        assertThat(paymentStatusHistoryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the PaymentStatusHistory in Elasticsearch
        verify(mockPaymentStatusHistorySearchRepository, times(0)).save(paymentStatusHistory);
    }

    @Test
    @Transactional
    public void deletePaymentStatusHistory() throws Exception {
        // Initialize the database
        paymentStatusHistoryRepository.saveAndFlush(paymentStatusHistory);

        int databaseSizeBeforeDelete = paymentStatusHistoryRepository.findAll().size();

        // Delete the paymentStatusHistory
        restPaymentStatusHistoryMockMvc.perform(delete("/api/payment-status-histories/{id}", paymentStatusHistory.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PaymentStatusHistory> paymentStatusHistoryList = paymentStatusHistoryRepository.findAll();
        assertThat(paymentStatusHistoryList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the PaymentStatusHistory in Elasticsearch
        verify(mockPaymentStatusHistorySearchRepository, times(1)).deleteById(paymentStatusHistory.getId());
    }

    @Test
    @Transactional
    public void searchPaymentStatusHistory() throws Exception {
        // Initialize the database
        paymentStatusHistoryRepository.saveAndFlush(paymentStatusHistory);
        when(mockPaymentStatusHistorySearchRepository.search(queryStringQuery("id:" + paymentStatusHistory.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(paymentStatusHistory), PageRequest.of(0, 1), 1));
        // Search the paymentStatusHistory
        restPaymentStatusHistoryMockMvc.perform(get("/api/_search/payment-status-histories?query=id:" + paymentStatusHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentStatusHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].effectiveDate").value(hasItem(sameInstant(DEFAULT_EFFECTIVE_DATE))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
}
