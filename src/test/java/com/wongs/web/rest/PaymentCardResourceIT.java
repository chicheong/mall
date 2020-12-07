package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.PaymentCard;
import com.wongs.repository.PaymentCardRepository;
import com.wongs.repository.search.PaymentCardSearchRepository;
import com.wongs.service.PaymentCardService;
import com.wongs.service.dto.PaymentCardDTO;
import com.wongs.service.mapper.PaymentCardMapper;

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
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link PaymentCardResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class PaymentCardResourceIT {

    private static final String DEFAULT_HOLDER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_HOLDER_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CARD_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_CARD_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_EXPIRATION_MONTH = "AAAAAAAAAA";
    private static final String UPDATED_EXPIRATION_MONTH = "BBBBBBBBBB";

    private static final String DEFAULT_EXPIRATION_YEAR = "AAAAAAAAAA";
    private static final String UPDATED_EXPIRATION_YEAR = "BBBBBBBBBB";

    private static final String DEFAULT_CVC = "AAAAAAAAAA";
    private static final String UPDATED_CVC = "BBBBBBBBBB";

    @Autowired
    private PaymentCardRepository paymentCardRepository;

    @Autowired
    private PaymentCardMapper paymentCardMapper;

    @Autowired
    private PaymentCardService paymentCardService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.PaymentCardSearchRepositoryMockConfiguration
     */
    @Autowired
    private PaymentCardSearchRepository mockPaymentCardSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPaymentCardMockMvc;

    private PaymentCard paymentCard;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PaymentCard createEntity(EntityManager em) {
        PaymentCard paymentCard = new PaymentCard()
            .holderName(DEFAULT_HOLDER_NAME)
            .cardNumber(DEFAULT_CARD_NUMBER)
            .expirationMonth(DEFAULT_EXPIRATION_MONTH)
            .expirationYear(DEFAULT_EXPIRATION_YEAR)
            .cvc(DEFAULT_CVC);
        return paymentCard;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PaymentCard createUpdatedEntity(EntityManager em) {
        PaymentCard paymentCard = new PaymentCard()
            .holderName(UPDATED_HOLDER_NAME)
            .cardNumber(UPDATED_CARD_NUMBER)
            .expirationMonth(UPDATED_EXPIRATION_MONTH)
            .expirationYear(UPDATED_EXPIRATION_YEAR)
            .cvc(UPDATED_CVC);
        return paymentCard;
    }

    @BeforeEach
    public void initTest() {
        paymentCard = createEntity(em);
    }

    @Test
    @Transactional
    public void createPaymentCard() throws Exception {
        int databaseSizeBeforeCreate = paymentCardRepository.findAll().size();

        // Create the PaymentCard
        PaymentCardDTO paymentCardDTO = paymentCardMapper.toDto(paymentCard);
        restPaymentCardMockMvc.perform(post("/api/payment-cards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(paymentCardDTO)))
            .andExpect(status().isCreated());

        // Validate the PaymentCard in the database
        List<PaymentCard> paymentCardList = paymentCardRepository.findAll();
        assertThat(paymentCardList).hasSize(databaseSizeBeforeCreate + 1);
        PaymentCard testPaymentCard = paymentCardList.get(paymentCardList.size() - 1);
        assertThat(testPaymentCard.getHolderName()).isEqualTo(DEFAULT_HOLDER_NAME);
        assertThat(testPaymentCard.getCardNumber()).isEqualTo(DEFAULT_CARD_NUMBER);
        assertThat(testPaymentCard.getExpirationMonth()).isEqualTo(DEFAULT_EXPIRATION_MONTH);
        assertThat(testPaymentCard.getExpirationYear()).isEqualTo(DEFAULT_EXPIRATION_YEAR);
        assertThat(testPaymentCard.getCvc()).isEqualTo(DEFAULT_CVC);

        // Validate the PaymentCard in Elasticsearch
        verify(mockPaymentCardSearchRepository, times(1)).save(testPaymentCard);
    }

    @Test
    @Transactional
    public void createPaymentCardWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = paymentCardRepository.findAll().size();

        // Create the PaymentCard with an existing ID
        paymentCard.setId(1L);
        PaymentCardDTO paymentCardDTO = paymentCardMapper.toDto(paymentCard);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaymentCardMockMvc.perform(post("/api/payment-cards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(paymentCardDTO)))
            .andExpect(status().isBadRequest());

        // Validate the PaymentCard in the database
        List<PaymentCard> paymentCardList = paymentCardRepository.findAll();
        assertThat(paymentCardList).hasSize(databaseSizeBeforeCreate);

        // Validate the PaymentCard in Elasticsearch
        verify(mockPaymentCardSearchRepository, times(0)).save(paymentCard);
    }


    @Test
    @Transactional
    public void getAllPaymentCards() throws Exception {
        // Initialize the database
        paymentCardRepository.saveAndFlush(paymentCard);

        // Get all the paymentCardList
        restPaymentCardMockMvc.perform(get("/api/payment-cards?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentCard.getId().intValue())))
            .andExpect(jsonPath("$.[*].holderName").value(hasItem(DEFAULT_HOLDER_NAME)))
            .andExpect(jsonPath("$.[*].cardNumber").value(hasItem(DEFAULT_CARD_NUMBER)))
            .andExpect(jsonPath("$.[*].expirationMonth").value(hasItem(DEFAULT_EXPIRATION_MONTH)))
            .andExpect(jsonPath("$.[*].expirationYear").value(hasItem(DEFAULT_EXPIRATION_YEAR)))
            .andExpect(jsonPath("$.[*].cvc").value(hasItem(DEFAULT_CVC)));
    }
    
    @Test
    @Transactional
    public void getPaymentCard() throws Exception {
        // Initialize the database
        paymentCardRepository.saveAndFlush(paymentCard);

        // Get the paymentCard
        restPaymentCardMockMvc.perform(get("/api/payment-cards/{id}", paymentCard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(paymentCard.getId().intValue()))
            .andExpect(jsonPath("$.holderName").value(DEFAULT_HOLDER_NAME))
            .andExpect(jsonPath("$.cardNumber").value(DEFAULT_CARD_NUMBER))
            .andExpect(jsonPath("$.expirationMonth").value(DEFAULT_EXPIRATION_MONTH))
            .andExpect(jsonPath("$.expirationYear").value(DEFAULT_EXPIRATION_YEAR))
            .andExpect(jsonPath("$.cvc").value(DEFAULT_CVC));
    }

    @Test
    @Transactional
    public void getNonExistingPaymentCard() throws Exception {
        // Get the paymentCard
        restPaymentCardMockMvc.perform(get("/api/payment-cards/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePaymentCard() throws Exception {
        // Initialize the database
        paymentCardRepository.saveAndFlush(paymentCard);

        int databaseSizeBeforeUpdate = paymentCardRepository.findAll().size();

        // Update the paymentCard
        PaymentCard updatedPaymentCard = paymentCardRepository.findById(paymentCard.getId()).get();
        // Disconnect from session so that the updates on updatedPaymentCard are not directly saved in db
        em.detach(updatedPaymentCard);
        updatedPaymentCard
            .holderName(UPDATED_HOLDER_NAME)
            .cardNumber(UPDATED_CARD_NUMBER)
            .expirationMonth(UPDATED_EXPIRATION_MONTH)
            .expirationYear(UPDATED_EXPIRATION_YEAR)
            .cvc(UPDATED_CVC);
        PaymentCardDTO paymentCardDTO = paymentCardMapper.toDto(updatedPaymentCard);

        restPaymentCardMockMvc.perform(put("/api/payment-cards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(paymentCardDTO)))
            .andExpect(status().isOk());

        // Validate the PaymentCard in the database
        List<PaymentCard> paymentCardList = paymentCardRepository.findAll();
        assertThat(paymentCardList).hasSize(databaseSizeBeforeUpdate);
        PaymentCard testPaymentCard = paymentCardList.get(paymentCardList.size() - 1);
        assertThat(testPaymentCard.getHolderName()).isEqualTo(UPDATED_HOLDER_NAME);
        assertThat(testPaymentCard.getCardNumber()).isEqualTo(UPDATED_CARD_NUMBER);
        assertThat(testPaymentCard.getExpirationMonth()).isEqualTo(UPDATED_EXPIRATION_MONTH);
        assertThat(testPaymentCard.getExpirationYear()).isEqualTo(UPDATED_EXPIRATION_YEAR);
        assertThat(testPaymentCard.getCvc()).isEqualTo(UPDATED_CVC);

        // Validate the PaymentCard in Elasticsearch
        verify(mockPaymentCardSearchRepository, times(1)).save(testPaymentCard);
    }

    @Test
    @Transactional
    public void updateNonExistingPaymentCard() throws Exception {
        int databaseSizeBeforeUpdate = paymentCardRepository.findAll().size();

        // Create the PaymentCard
        PaymentCardDTO paymentCardDTO = paymentCardMapper.toDto(paymentCard);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaymentCardMockMvc.perform(put("/api/payment-cards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(paymentCardDTO)))
            .andExpect(status().isBadRequest());

        // Validate the PaymentCard in the database
        List<PaymentCard> paymentCardList = paymentCardRepository.findAll();
        assertThat(paymentCardList).hasSize(databaseSizeBeforeUpdate);

        // Validate the PaymentCard in Elasticsearch
        verify(mockPaymentCardSearchRepository, times(0)).save(paymentCard);
    }

    @Test
    @Transactional
    public void deletePaymentCard() throws Exception {
        // Initialize the database
        paymentCardRepository.saveAndFlush(paymentCard);

        int databaseSizeBeforeDelete = paymentCardRepository.findAll().size();

        // Delete the paymentCard
        restPaymentCardMockMvc.perform(delete("/api/payment-cards/{id}", paymentCard.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PaymentCard> paymentCardList = paymentCardRepository.findAll();
        assertThat(paymentCardList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the PaymentCard in Elasticsearch
        verify(mockPaymentCardSearchRepository, times(1)).deleteById(paymentCard.getId());
    }

    @Test
    @Transactional
    public void searchPaymentCard() throws Exception {
        // Initialize the database
        paymentCardRepository.saveAndFlush(paymentCard);
        when(mockPaymentCardSearchRepository.search(queryStringQuery("id:" + paymentCard.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(paymentCard), PageRequest.of(0, 1), 1));
        // Search the paymentCard
        restPaymentCardMockMvc.perform(get("/api/_search/payment-cards?query=id:" + paymentCard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentCard.getId().intValue())))
            .andExpect(jsonPath("$.[*].holderName").value(hasItem(DEFAULT_HOLDER_NAME)))
            .andExpect(jsonPath("$.[*].cardNumber").value(hasItem(DEFAULT_CARD_NUMBER)))
            .andExpect(jsonPath("$.[*].expirationMonth").value(hasItem(DEFAULT_EXPIRATION_MONTH)))
            .andExpect(jsonPath("$.[*].expirationYear").value(hasItem(DEFAULT_EXPIRATION_YEAR)))
            .andExpect(jsonPath("$.[*].cvc").value(hasItem(DEFAULT_CVC)));
    }
}
