package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.PaymentCreditCard;
import com.wongs.repository.PaymentCreditCardRepository;
import com.wongs.repository.search.PaymentCreditCardSearchRepository;
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
 * Test class for the PaymentCreditCardResource REST controller.
 *
 * @see PaymentCreditCardResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class PaymentCreditCardResourceIntTest {

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
    private PaymentCreditCardRepository paymentCreditCardRepository;

    @Autowired
    private PaymentCreditCardSearchRepository paymentCreditCardSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPaymentCreditCardMockMvc;

    private PaymentCreditCard paymentCreditCard;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PaymentCreditCardResource paymentCreditCardResource = new PaymentCreditCardResource(paymentCreditCardRepository, paymentCreditCardSearchRepository);
        this.restPaymentCreditCardMockMvc = MockMvcBuilders.standaloneSetup(paymentCreditCardResource)
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
    public static PaymentCreditCard createEntity(EntityManager em) {
        PaymentCreditCard paymentCreditCard = new PaymentCreditCard()
            .holderName(DEFAULT_HOLDER_NAME)
            .cardNumber(DEFAULT_CARD_NUMBER)
            .expirationMonth(DEFAULT_EXPIRATION_MONTH)
            .expirationYear(DEFAULT_EXPIRATION_YEAR)
            .cvc(DEFAULT_CVC);
        return paymentCreditCard;
    }

    @Before
    public void initTest() {
        paymentCreditCardSearchRepository.deleteAll();
        paymentCreditCard = createEntity(em);
    }

    @Test
    @Transactional
    public void createPaymentCreditCard() throws Exception {
        int databaseSizeBeforeCreate = paymentCreditCardRepository.findAll().size();

        // Create the PaymentCreditCard
        restPaymentCreditCardMockMvc.perform(post("/api/payment-credit-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentCreditCard)))
            .andExpect(status().isCreated());

        // Validate the PaymentCreditCard in the database
        List<PaymentCreditCard> paymentCreditCardList = paymentCreditCardRepository.findAll();
        assertThat(paymentCreditCardList).hasSize(databaseSizeBeforeCreate + 1);
        PaymentCreditCard testPaymentCreditCard = paymentCreditCardList.get(paymentCreditCardList.size() - 1);
        assertThat(testPaymentCreditCard.getHolderName()).isEqualTo(DEFAULT_HOLDER_NAME);
        assertThat(testPaymentCreditCard.getCardNumber()).isEqualTo(DEFAULT_CARD_NUMBER);
        assertThat(testPaymentCreditCard.getExpirationMonth()).isEqualTo(DEFAULT_EXPIRATION_MONTH);
        assertThat(testPaymentCreditCard.getExpirationYear()).isEqualTo(DEFAULT_EXPIRATION_YEAR);
        assertThat(testPaymentCreditCard.getCvc()).isEqualTo(DEFAULT_CVC);

        // Validate the PaymentCreditCard in Elasticsearch
        PaymentCreditCard paymentCreditCardEs = paymentCreditCardSearchRepository.findOne(testPaymentCreditCard.getId());
        assertThat(paymentCreditCardEs).isEqualToIgnoringGivenFields(testPaymentCreditCard);
    }

    @Test
    @Transactional
    public void createPaymentCreditCardWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = paymentCreditCardRepository.findAll().size();

        // Create the PaymentCreditCard with an existing ID
        paymentCreditCard.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaymentCreditCardMockMvc.perform(post("/api/payment-credit-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentCreditCard)))
            .andExpect(status().isBadRequest());

        // Validate the PaymentCreditCard in the database
        List<PaymentCreditCard> paymentCreditCardList = paymentCreditCardRepository.findAll();
        assertThat(paymentCreditCardList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllPaymentCreditCards() throws Exception {
        // Initialize the database
        paymentCreditCardRepository.saveAndFlush(paymentCreditCard);

        // Get all the paymentCreditCardList
        restPaymentCreditCardMockMvc.perform(get("/api/payment-credit-cards?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentCreditCard.getId().intValue())))
            .andExpect(jsonPath("$.[*].holderName").value(hasItem(DEFAULT_HOLDER_NAME.toString())))
            .andExpect(jsonPath("$.[*].cardNumber").value(hasItem(DEFAULT_CARD_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].expirationMonth").value(hasItem(DEFAULT_EXPIRATION_MONTH.toString())))
            .andExpect(jsonPath("$.[*].expirationYear").value(hasItem(DEFAULT_EXPIRATION_YEAR.toString())))
            .andExpect(jsonPath("$.[*].cvc").value(hasItem(DEFAULT_CVC.toString())));
    }

    @Test
    @Transactional
    public void getPaymentCreditCard() throws Exception {
        // Initialize the database
        paymentCreditCardRepository.saveAndFlush(paymentCreditCard);

        // Get the paymentCreditCard
        restPaymentCreditCardMockMvc.perform(get("/api/payment-credit-cards/{id}", paymentCreditCard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(paymentCreditCard.getId().intValue()))
            .andExpect(jsonPath("$.holderName").value(DEFAULT_HOLDER_NAME.toString()))
            .andExpect(jsonPath("$.cardNumber").value(DEFAULT_CARD_NUMBER.toString()))
            .andExpect(jsonPath("$.expirationMonth").value(DEFAULT_EXPIRATION_MONTH.toString()))
            .andExpect(jsonPath("$.expirationYear").value(DEFAULT_EXPIRATION_YEAR.toString()))
            .andExpect(jsonPath("$.cvc").value(DEFAULT_CVC.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPaymentCreditCard() throws Exception {
        // Get the paymentCreditCard
        restPaymentCreditCardMockMvc.perform(get("/api/payment-credit-cards/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePaymentCreditCard() throws Exception {
        // Initialize the database
        paymentCreditCardRepository.saveAndFlush(paymentCreditCard);
        paymentCreditCardSearchRepository.save(paymentCreditCard);
        int databaseSizeBeforeUpdate = paymentCreditCardRepository.findAll().size();

        // Update the paymentCreditCard
        PaymentCreditCard updatedPaymentCreditCard = paymentCreditCardRepository.findOne(paymentCreditCard.getId());
        // Disconnect from session so that the updates on updatedPaymentCreditCard are not directly saved in db
        em.detach(updatedPaymentCreditCard);
        updatedPaymentCreditCard
            .holderName(UPDATED_HOLDER_NAME)
            .cardNumber(UPDATED_CARD_NUMBER)
            .expirationMonth(UPDATED_EXPIRATION_MONTH)
            .expirationYear(UPDATED_EXPIRATION_YEAR)
            .cvc(UPDATED_CVC);

        restPaymentCreditCardMockMvc.perform(put("/api/payment-credit-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPaymentCreditCard)))
            .andExpect(status().isOk());

        // Validate the PaymentCreditCard in the database
        List<PaymentCreditCard> paymentCreditCardList = paymentCreditCardRepository.findAll();
        assertThat(paymentCreditCardList).hasSize(databaseSizeBeforeUpdate);
        PaymentCreditCard testPaymentCreditCard = paymentCreditCardList.get(paymentCreditCardList.size() - 1);
        assertThat(testPaymentCreditCard.getHolderName()).isEqualTo(UPDATED_HOLDER_NAME);
        assertThat(testPaymentCreditCard.getCardNumber()).isEqualTo(UPDATED_CARD_NUMBER);
        assertThat(testPaymentCreditCard.getExpirationMonth()).isEqualTo(UPDATED_EXPIRATION_MONTH);
        assertThat(testPaymentCreditCard.getExpirationYear()).isEqualTo(UPDATED_EXPIRATION_YEAR);
        assertThat(testPaymentCreditCard.getCvc()).isEqualTo(UPDATED_CVC);

        // Validate the PaymentCreditCard in Elasticsearch
        PaymentCreditCard paymentCreditCardEs = paymentCreditCardSearchRepository.findOne(testPaymentCreditCard.getId());
        assertThat(paymentCreditCardEs).isEqualToIgnoringGivenFields(testPaymentCreditCard);
    }

    @Test
    @Transactional
    public void updateNonExistingPaymentCreditCard() throws Exception {
        int databaseSizeBeforeUpdate = paymentCreditCardRepository.findAll().size();

        // Create the PaymentCreditCard

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPaymentCreditCardMockMvc.perform(put("/api/payment-credit-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentCreditCard)))
            .andExpect(status().isCreated());

        // Validate the PaymentCreditCard in the database
        List<PaymentCreditCard> paymentCreditCardList = paymentCreditCardRepository.findAll();
        assertThat(paymentCreditCardList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePaymentCreditCard() throws Exception {
        // Initialize the database
        paymentCreditCardRepository.saveAndFlush(paymentCreditCard);
        paymentCreditCardSearchRepository.save(paymentCreditCard);
        int databaseSizeBeforeDelete = paymentCreditCardRepository.findAll().size();

        // Get the paymentCreditCard
        restPaymentCreditCardMockMvc.perform(delete("/api/payment-credit-cards/{id}", paymentCreditCard.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean paymentCreditCardExistsInEs = paymentCreditCardSearchRepository.exists(paymentCreditCard.getId());
        assertThat(paymentCreditCardExistsInEs).isFalse();

        // Validate the database is empty
        List<PaymentCreditCard> paymentCreditCardList = paymentCreditCardRepository.findAll();
        assertThat(paymentCreditCardList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPaymentCreditCard() throws Exception {
        // Initialize the database
        paymentCreditCardRepository.saveAndFlush(paymentCreditCard);
        paymentCreditCardSearchRepository.save(paymentCreditCard);

        // Search the paymentCreditCard
        restPaymentCreditCardMockMvc.perform(get("/api/_search/payment-credit-cards?query=id:" + paymentCreditCard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentCreditCard.getId().intValue())))
            .andExpect(jsonPath("$.[*].holderName").value(hasItem(DEFAULT_HOLDER_NAME.toString())))
            .andExpect(jsonPath("$.[*].cardNumber").value(hasItem(DEFAULT_CARD_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].expirationMonth").value(hasItem(DEFAULT_EXPIRATION_MONTH.toString())))
            .andExpect(jsonPath("$.[*].expirationYear").value(hasItem(DEFAULT_EXPIRATION_YEAR.toString())))
            .andExpect(jsonPath("$.[*].cvc").value(hasItem(DEFAULT_CVC.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PaymentCreditCard.class);
        PaymentCreditCard paymentCreditCard1 = new PaymentCreditCard();
        paymentCreditCard1.setId(1L);
        PaymentCreditCard paymentCreditCard2 = new PaymentCreditCard();
        paymentCreditCard2.setId(paymentCreditCard1.getId());
        assertThat(paymentCreditCard1).isEqualTo(paymentCreditCard2);
        paymentCreditCard2.setId(2L);
        assertThat(paymentCreditCard1).isNotEqualTo(paymentCreditCard2);
        paymentCreditCard1.setId(null);
        assertThat(paymentCreditCard1).isNotEqualTo(paymentCreditCard2);
    }
}
