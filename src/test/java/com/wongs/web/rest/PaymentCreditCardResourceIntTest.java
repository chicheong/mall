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

/**
 * Test class for the PaymentCreditCardResource REST controller.
 *
 * @see PaymentCreditCardResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class PaymentCreditCardResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final String DEFAULT_HOLDER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_HOLDER_NAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_EXPIRE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_EXPIRE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

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
            .name(DEFAULT_NAME)
            .value(DEFAULT_VALUE)
            .holderName(DEFAULT_HOLDER_NAME)
            .expireDate(DEFAULT_EXPIRE_DATE);
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
        assertThat(testPaymentCreditCard.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPaymentCreditCard.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testPaymentCreditCard.getHolderName()).isEqualTo(DEFAULT_HOLDER_NAME);
        assertThat(testPaymentCreditCard.getExpireDate()).isEqualTo(DEFAULT_EXPIRE_DATE);

        // Validate the PaymentCreditCard in Elasticsearch
        PaymentCreditCard paymentCreditCardEs = paymentCreditCardSearchRepository.findOne(testPaymentCreditCard.getId());
        assertThat(testPaymentCreditCard.getExpireDate()).isEqualTo(testPaymentCreditCard.getExpireDate());
        assertThat(paymentCreditCardEs).isEqualToIgnoringGivenFields(testPaymentCreditCard, "expireDate");
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
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.toString())))
            .andExpect(jsonPath("$.[*].holderName").value(hasItem(DEFAULT_HOLDER_NAME.toString())))
            .andExpect(jsonPath("$.[*].expireDate").value(hasItem(sameInstant(DEFAULT_EXPIRE_DATE))));
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
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.toString()))
            .andExpect(jsonPath("$.holderName").value(DEFAULT_HOLDER_NAME.toString()))
            .andExpect(jsonPath("$.expireDate").value(sameInstant(DEFAULT_EXPIRE_DATE)));
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
            .name(UPDATED_NAME)
            .value(UPDATED_VALUE)
            .holderName(UPDATED_HOLDER_NAME)
            .expireDate(UPDATED_EXPIRE_DATE);

        restPaymentCreditCardMockMvc.perform(put("/api/payment-credit-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPaymentCreditCard)))
            .andExpect(status().isOk());

        // Validate the PaymentCreditCard in the database
        List<PaymentCreditCard> paymentCreditCardList = paymentCreditCardRepository.findAll();
        assertThat(paymentCreditCardList).hasSize(databaseSizeBeforeUpdate);
        PaymentCreditCard testPaymentCreditCard = paymentCreditCardList.get(paymentCreditCardList.size() - 1);
        assertThat(testPaymentCreditCard.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPaymentCreditCard.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testPaymentCreditCard.getHolderName()).isEqualTo(UPDATED_HOLDER_NAME);
        assertThat(testPaymentCreditCard.getExpireDate()).isEqualTo(UPDATED_EXPIRE_DATE);

        // Validate the PaymentCreditCard in Elasticsearch
        PaymentCreditCard paymentCreditCardEs = paymentCreditCardSearchRepository.findOne(testPaymentCreditCard.getId());
        assertThat(testPaymentCreditCard.getExpireDate()).isEqualTo(testPaymentCreditCard.getExpireDate());
        assertThat(paymentCreditCardEs).isEqualToIgnoringGivenFields(testPaymentCreditCard, "expireDate");
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
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.toString())))
            .andExpect(jsonPath("$.[*].holderName").value(hasItem(DEFAULT_HOLDER_NAME.toString())))
            .andExpect(jsonPath("$.[*].expireDate").value(hasItem(sameInstant(DEFAULT_EXPIRE_DATE))));
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
