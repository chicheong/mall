package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.CreditCard;
import com.wongs.repository.CreditCardRepository;
import com.wongs.repository.search.CreditCardSearchRepository;
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
 * Test class for the CreditCardResource REST controller.
 *
 * @see CreditCardResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class CreditCardResourceIntTest {

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
    private CreditCardRepository creditCardRepository;

    @Autowired
    private CreditCardSearchRepository creditCardSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCreditCardMockMvc;

    private CreditCard creditCard;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CreditCardResource creditCardResource = new CreditCardResource(creditCardRepository, creditCardSearchRepository);
        this.restCreditCardMockMvc = MockMvcBuilders.standaloneSetup(creditCardResource)
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
    public static CreditCard createEntity(EntityManager em) {
        CreditCard creditCard = new CreditCard()
            .holderName(DEFAULT_HOLDER_NAME)
            .cardNumber(DEFAULT_CARD_NUMBER)
            .expirationMonth(DEFAULT_EXPIRATION_MONTH)
            .expirationYear(DEFAULT_EXPIRATION_YEAR)
            .cvc(DEFAULT_CVC);
        return creditCard;
    }

    @Before
    public void initTest() {
        creditCardSearchRepository.deleteAll();
        creditCard = createEntity(em);
    }

    @Test
    @Transactional
    public void createCreditCard() throws Exception {
        int databaseSizeBeforeCreate = creditCardRepository.findAll().size();

        // Create the CreditCard
        restCreditCardMockMvc.perform(post("/api/credit-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(creditCard)))
            .andExpect(status().isCreated());

        // Validate the CreditCard in the database
        List<CreditCard> creditCardList = creditCardRepository.findAll();
        assertThat(creditCardList).hasSize(databaseSizeBeforeCreate + 1);
        CreditCard testCreditCard = creditCardList.get(creditCardList.size() - 1);
        assertThat(testCreditCard.getHolderName()).isEqualTo(DEFAULT_HOLDER_NAME);
        assertThat(testCreditCard.getCardNumber()).isEqualTo(DEFAULT_CARD_NUMBER);
        assertThat(testCreditCard.getExpirationMonth()).isEqualTo(DEFAULT_EXPIRATION_MONTH);
        assertThat(testCreditCard.getExpirationYear()).isEqualTo(DEFAULT_EXPIRATION_YEAR);
        assertThat(testCreditCard.getCvc()).isEqualTo(DEFAULT_CVC);

        // Validate the CreditCard in Elasticsearch
        CreditCard creditCardEs = creditCardSearchRepository.findOne(testCreditCard.getId());
        assertThat(creditCardEs).isEqualToIgnoringGivenFields(testCreditCard);
    }

    @Test
    @Transactional
    public void createCreditCardWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = creditCardRepository.findAll().size();

        // Create the CreditCard with an existing ID
        creditCard.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCreditCardMockMvc.perform(post("/api/credit-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(creditCard)))
            .andExpect(status().isBadRequest());

        // Validate the CreditCard in the database
        List<CreditCard> creditCardList = creditCardRepository.findAll();
        assertThat(creditCardList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllCreditCards() throws Exception {
        // Initialize the database
        creditCardRepository.saveAndFlush(creditCard);

        // Get all the creditCardList
        restCreditCardMockMvc.perform(get("/api/credit-cards?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(creditCard.getId().intValue())))
            .andExpect(jsonPath("$.[*].holderName").value(hasItem(DEFAULT_HOLDER_NAME.toString())))
            .andExpect(jsonPath("$.[*].cardNumber").value(hasItem(DEFAULT_CARD_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].expirationMonth").value(hasItem(DEFAULT_EXPIRATION_MONTH.toString())))
            .andExpect(jsonPath("$.[*].expirationYear").value(hasItem(DEFAULT_EXPIRATION_YEAR.toString())))
            .andExpect(jsonPath("$.[*].cvc").value(hasItem(DEFAULT_CVC.toString())));
    }

    @Test
    @Transactional
    public void getCreditCard() throws Exception {
        // Initialize the database
        creditCardRepository.saveAndFlush(creditCard);

        // Get the creditCard
        restCreditCardMockMvc.perform(get("/api/credit-cards/{id}", creditCard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(creditCard.getId().intValue()))
            .andExpect(jsonPath("$.holderName").value(DEFAULT_HOLDER_NAME.toString()))
            .andExpect(jsonPath("$.cardNumber").value(DEFAULT_CARD_NUMBER.toString()))
            .andExpect(jsonPath("$.expirationMonth").value(DEFAULT_EXPIRATION_MONTH.toString()))
            .andExpect(jsonPath("$.expirationYear").value(DEFAULT_EXPIRATION_YEAR.toString()))
            .andExpect(jsonPath("$.cvc").value(DEFAULT_CVC.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCreditCard() throws Exception {
        // Get the creditCard
        restCreditCardMockMvc.perform(get("/api/credit-cards/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCreditCard() throws Exception {
        // Initialize the database
        creditCardRepository.saveAndFlush(creditCard);
        creditCardSearchRepository.save(creditCard);
        int databaseSizeBeforeUpdate = creditCardRepository.findAll().size();

        // Update the creditCard
        CreditCard updatedCreditCard = creditCardRepository.findOne(creditCard.getId());
        // Disconnect from session so that the updates on updatedCreditCard are not directly saved in db
        em.detach(updatedCreditCard);
        updatedCreditCard
            .holderName(UPDATED_HOLDER_NAME)
            .cardNumber(UPDATED_CARD_NUMBER)
            .expirationMonth(UPDATED_EXPIRATION_MONTH)
            .expirationYear(UPDATED_EXPIRATION_YEAR)
            .cvc(UPDATED_CVC);

        restCreditCardMockMvc.perform(put("/api/credit-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCreditCard)))
            .andExpect(status().isOk());

        // Validate the CreditCard in the database
        List<CreditCard> creditCardList = creditCardRepository.findAll();
        assertThat(creditCardList).hasSize(databaseSizeBeforeUpdate);
        CreditCard testCreditCard = creditCardList.get(creditCardList.size() - 1);
        assertThat(testCreditCard.getHolderName()).isEqualTo(UPDATED_HOLDER_NAME);
        assertThat(testCreditCard.getCardNumber()).isEqualTo(UPDATED_CARD_NUMBER);
        assertThat(testCreditCard.getExpirationMonth()).isEqualTo(UPDATED_EXPIRATION_MONTH);
        assertThat(testCreditCard.getExpirationYear()).isEqualTo(UPDATED_EXPIRATION_YEAR);
        assertThat(testCreditCard.getCvc()).isEqualTo(UPDATED_CVC);

        // Validate the CreditCard in Elasticsearch
        CreditCard creditCardEs = creditCardSearchRepository.findOne(testCreditCard.getId());
        assertThat(creditCardEs).isEqualToIgnoringGivenFields(testCreditCard);
    }

    @Test
    @Transactional
    public void updateNonExistingCreditCard() throws Exception {
        int databaseSizeBeforeUpdate = creditCardRepository.findAll().size();

        // Create the CreditCard

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCreditCardMockMvc.perform(put("/api/credit-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(creditCard)))
            .andExpect(status().isCreated());

        // Validate the CreditCard in the database
        List<CreditCard> creditCardList = creditCardRepository.findAll();
        assertThat(creditCardList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCreditCard() throws Exception {
        // Initialize the database
        creditCardRepository.saveAndFlush(creditCard);
        creditCardSearchRepository.save(creditCard);
        int databaseSizeBeforeDelete = creditCardRepository.findAll().size();

        // Get the creditCard
        restCreditCardMockMvc.perform(delete("/api/credit-cards/{id}", creditCard.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean creditCardExistsInEs = creditCardSearchRepository.exists(creditCard.getId());
        assertThat(creditCardExistsInEs).isFalse();

        // Validate the database is empty
        List<CreditCard> creditCardList = creditCardRepository.findAll();
        assertThat(creditCardList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchCreditCard() throws Exception {
        // Initialize the database
        creditCardRepository.saveAndFlush(creditCard);
        creditCardSearchRepository.save(creditCard);

        // Search the creditCard
        restCreditCardMockMvc.perform(get("/api/_search/credit-cards?query=id:" + creditCard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(creditCard.getId().intValue())))
            .andExpect(jsonPath("$.[*].holderName").value(hasItem(DEFAULT_HOLDER_NAME.toString())))
            .andExpect(jsonPath("$.[*].cardNumber").value(hasItem(DEFAULT_CARD_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].expirationMonth").value(hasItem(DEFAULT_EXPIRATION_MONTH.toString())))
            .andExpect(jsonPath("$.[*].expirationYear").value(hasItem(DEFAULT_EXPIRATION_YEAR.toString())))
            .andExpect(jsonPath("$.[*].cvc").value(hasItem(DEFAULT_CVC.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CreditCard.class);
        CreditCard creditCard1 = new CreditCard();
        creditCard1.setId(1L);
        CreditCard creditCard2 = new CreditCard();
        creditCard2.setId(creditCard1.getId());
        assertThat(creditCard1).isEqualTo(creditCard2);
        creditCard2.setId(2L);
        assertThat(creditCard1).isNotEqualTo(creditCard2);
        creditCard1.setId(null);
        assertThat(creditCard1).isNotEqualTo(creditCard2);
    }
}
