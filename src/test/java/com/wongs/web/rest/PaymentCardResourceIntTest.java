package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.PaymentCard;
import com.wongs.repository.PaymentCardRepository;
import com.wongs.repository.search.PaymentCardSearchRepository;
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
import java.util.List;

import static com.wongs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PaymentCardResource REST controller.
 *
 * @see PaymentCardResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class PaymentCardResourceIntTest {

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
    private PaymentCardSearchRepository paymentCardSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPaymentCardMockMvc;

    private PaymentCard paymentCard;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PaymentCardResource paymentCardResource = new PaymentCardResource(paymentCardRepository, paymentCardSearchRepository);
        this.restPaymentCardMockMvc = MockMvcBuilders.standaloneSetup(paymentCardResource)
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
    public static PaymentCard createEntity(EntityManager em) {
        PaymentCard paymentCard = new PaymentCard()
            .holderName(DEFAULT_HOLDER_NAME)
            .cardNumber(DEFAULT_CARD_NUMBER)
            .expirationMonth(DEFAULT_EXPIRATION_MONTH)
            .expirationYear(DEFAULT_EXPIRATION_YEAR)
            .cvc(DEFAULT_CVC);
        return paymentCard;
    }

    @Before
    public void initTest() {
        paymentCardSearchRepository.deleteAll();
        paymentCard = createEntity(em);
    }

    @Test
    @Transactional
    public void createPaymentCard() throws Exception {
        int databaseSizeBeforeCreate = paymentCardRepository.findAll().size();

        // Create the PaymentCard
        restPaymentCardMockMvc.perform(post("/api/payment-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentCard)))
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
        PaymentCard paymentCardEs = paymentCardSearchRepository.findOne(testPaymentCard.getId());
        assertThat(paymentCardEs).isEqualToIgnoringGivenFields(testPaymentCard);
    }

    @Test
    @Transactional
    public void createPaymentCardWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = paymentCardRepository.findAll().size();

        // Create the PaymentCard with an existing ID
        paymentCard.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaymentCardMockMvc.perform(post("/api/payment-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentCard)))
            .andExpect(status().isBadRequest());

        // Validate the PaymentCard in the database
        List<PaymentCard> paymentCardList = paymentCardRepository.findAll();
        assertThat(paymentCardList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllPaymentCards() throws Exception {
        // Initialize the database
        paymentCardRepository.saveAndFlush(paymentCard);

        // Get all the paymentCardList
        restPaymentCardMockMvc.perform(get("/api/payment-cards?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentCard.getId().intValue())))
            .andExpect(jsonPath("$.[*].holderName").value(hasItem(DEFAULT_HOLDER_NAME.toString())))
            .andExpect(jsonPath("$.[*].cardNumber").value(hasItem(DEFAULT_CARD_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].expirationMonth").value(hasItem(DEFAULT_EXPIRATION_MONTH.toString())))
            .andExpect(jsonPath("$.[*].expirationYear").value(hasItem(DEFAULT_EXPIRATION_YEAR.toString())))
            .andExpect(jsonPath("$.[*].cvc").value(hasItem(DEFAULT_CVC.toString())));
    }

    @Test
    @Transactional
    public void getPaymentCard() throws Exception {
        // Initialize the database
        paymentCardRepository.saveAndFlush(paymentCard);

        // Get the paymentCard
        restPaymentCardMockMvc.perform(get("/api/payment-cards/{id}", paymentCard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(paymentCard.getId().intValue()))
            .andExpect(jsonPath("$.holderName").value(DEFAULT_HOLDER_NAME.toString()))
            .andExpect(jsonPath("$.cardNumber").value(DEFAULT_CARD_NUMBER.toString()))
            .andExpect(jsonPath("$.expirationMonth").value(DEFAULT_EXPIRATION_MONTH.toString()))
            .andExpect(jsonPath("$.expirationYear").value(DEFAULT_EXPIRATION_YEAR.toString()))
            .andExpect(jsonPath("$.cvc").value(DEFAULT_CVC.toString()));
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
        paymentCardSearchRepository.save(paymentCard);
        int databaseSizeBeforeUpdate = paymentCardRepository.findAll().size();

        // Update the paymentCard
        PaymentCard updatedPaymentCard = paymentCardRepository.findOne(paymentCard.getId());
        // Disconnect from session so that the updates on updatedPaymentCard are not directly saved in db
        em.detach(updatedPaymentCard);
        updatedPaymentCard
            .holderName(UPDATED_HOLDER_NAME)
            .cardNumber(UPDATED_CARD_NUMBER)
            .expirationMonth(UPDATED_EXPIRATION_MONTH)
            .expirationYear(UPDATED_EXPIRATION_YEAR)
            .cvc(UPDATED_CVC);

        restPaymentCardMockMvc.perform(put("/api/payment-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPaymentCard)))
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
        PaymentCard paymentCardEs = paymentCardSearchRepository.findOne(testPaymentCard.getId());
        assertThat(paymentCardEs).isEqualToIgnoringGivenFields(testPaymentCard);
    }

    @Test
    @Transactional
    public void updateNonExistingPaymentCard() throws Exception {
        int databaseSizeBeforeUpdate = paymentCardRepository.findAll().size();

        // Create the PaymentCard

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPaymentCardMockMvc.perform(put("/api/payment-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentCard)))
            .andExpect(status().isCreated());

        // Validate the PaymentCard in the database
        List<PaymentCard> paymentCardList = paymentCardRepository.findAll();
        assertThat(paymentCardList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePaymentCard() throws Exception {
        // Initialize the database
        paymentCardRepository.saveAndFlush(paymentCard);
        paymentCardSearchRepository.save(paymentCard);
        int databaseSizeBeforeDelete = paymentCardRepository.findAll().size();

        // Get the paymentCard
        restPaymentCardMockMvc.perform(delete("/api/payment-cards/{id}", paymentCard.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean paymentCardExistsInEs = paymentCardSearchRepository.exists(paymentCard.getId());
        assertThat(paymentCardExistsInEs).isFalse();

        // Validate the database is empty
        List<PaymentCard> paymentCardList = paymentCardRepository.findAll();
        assertThat(paymentCardList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPaymentCard() throws Exception {
        // Initialize the database
        paymentCardRepository.saveAndFlush(paymentCard);
        paymentCardSearchRepository.save(paymentCard);

        // Search the paymentCard
        restPaymentCardMockMvc.perform(get("/api/_search/payment-cards?query=id:" + paymentCard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentCard.getId().intValue())))
            .andExpect(jsonPath("$.[*].holderName").value(hasItem(DEFAULT_HOLDER_NAME.toString())))
            .andExpect(jsonPath("$.[*].cardNumber").value(hasItem(DEFAULT_CARD_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].expirationMonth").value(hasItem(DEFAULT_EXPIRATION_MONTH.toString())))
            .andExpect(jsonPath("$.[*].expirationYear").value(hasItem(DEFAULT_EXPIRATION_YEAR.toString())))
            .andExpect(jsonPath("$.[*].cvc").value(hasItem(DEFAULT_CVC.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PaymentCard.class);
        PaymentCard paymentCard1 = new PaymentCard();
        paymentCard1.setId(1L);
        PaymentCard paymentCard2 = new PaymentCard();
        paymentCard2.setId(paymentCard1.getId());
        assertThat(paymentCard1).isEqualTo(paymentCard2);
        paymentCard2.setId(2L);
        assertThat(paymentCard1).isNotEqualTo(paymentCard2);
        paymentCard1.setId(null);
        assertThat(paymentCard1).isNotEqualTo(paymentCard2);
    }
}
