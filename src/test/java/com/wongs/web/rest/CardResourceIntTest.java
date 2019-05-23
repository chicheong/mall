package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.Card;
import com.wongs.repository.CardRepository;
import com.wongs.repository.search.CardSearchRepository;
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
import java.util.Collections;
import java.util.List;


import static com.wongs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the CardResource REST controller.
 *
 * @see CardResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class CardResourceIntTest {

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
    private CardRepository cardRepository;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.CardSearchRepositoryMockConfiguration
     */
    @Autowired
    private CardSearchRepository mockCardSearchRepository;

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

    private MockMvc restCardMockMvc;

    private Card card;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CardResource cardResource = new CardResource(cardRepository, mockCardSearchRepository);
        this.restCardMockMvc = MockMvcBuilders.standaloneSetup(cardResource)
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
    public static Card createEntity(EntityManager em) {
        Card card = new Card()
            .holderName(DEFAULT_HOLDER_NAME)
            .cardNumber(DEFAULT_CARD_NUMBER)
            .expirationMonth(DEFAULT_EXPIRATION_MONTH)
            .expirationYear(DEFAULT_EXPIRATION_YEAR)
            .cvc(DEFAULT_CVC);
        return card;
    }

    @Before
    public void initTest() {
        card = createEntity(em);
    }

    @Test
    @Transactional
    public void createCard() throws Exception {
        int databaseSizeBeforeCreate = cardRepository.findAll().size();

        // Create the Card
        restCardMockMvc.perform(post("/api/cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(card)))
            .andExpect(status().isCreated());

        // Validate the Card in the database
        List<Card> cardList = cardRepository.findAll();
        assertThat(cardList).hasSize(databaseSizeBeforeCreate + 1);
        Card testCard = cardList.get(cardList.size() - 1);
        assertThat(testCard.getHolderName()).isEqualTo(DEFAULT_HOLDER_NAME);
        assertThat(testCard.getCardNumber()).isEqualTo(DEFAULT_CARD_NUMBER);
        assertThat(testCard.getExpirationMonth()).isEqualTo(DEFAULT_EXPIRATION_MONTH);
        assertThat(testCard.getExpirationYear()).isEqualTo(DEFAULT_EXPIRATION_YEAR);
        assertThat(testCard.getCvc()).isEqualTo(DEFAULT_CVC);

        // Validate the Card in Elasticsearch
        verify(mockCardSearchRepository, times(1)).save(testCard);
    }

    @Test
    @Transactional
    public void createCardWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = cardRepository.findAll().size();

        // Create the Card with an existing ID
        card.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCardMockMvc.perform(post("/api/cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(card)))
            .andExpect(status().isBadRequest());

        // Validate the Card in the database
        List<Card> cardList = cardRepository.findAll();
        assertThat(cardList).hasSize(databaseSizeBeforeCreate);

        // Validate the Card in Elasticsearch
        verify(mockCardSearchRepository, times(0)).save(card);
    }

    @Test
    @Transactional
    public void getAllCards() throws Exception {
        // Initialize the database
        cardRepository.saveAndFlush(card);

        // Get all the cardList
        restCardMockMvc.perform(get("/api/cards?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(card.getId().intValue())))
            .andExpect(jsonPath("$.[*].holderName").value(hasItem(DEFAULT_HOLDER_NAME.toString())))
            .andExpect(jsonPath("$.[*].cardNumber").value(hasItem(DEFAULT_CARD_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].expirationMonth").value(hasItem(DEFAULT_EXPIRATION_MONTH.toString())))
            .andExpect(jsonPath("$.[*].expirationYear").value(hasItem(DEFAULT_EXPIRATION_YEAR.toString())))
            .andExpect(jsonPath("$.[*].cvc").value(hasItem(DEFAULT_CVC.toString())));
    }
    
    @Test
    @Transactional
    public void getCard() throws Exception {
        // Initialize the database
        cardRepository.saveAndFlush(card);

        // Get the card
        restCardMockMvc.perform(get("/api/cards/{id}", card.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(card.getId().intValue()))
            .andExpect(jsonPath("$.holderName").value(DEFAULT_HOLDER_NAME.toString()))
            .andExpect(jsonPath("$.cardNumber").value(DEFAULT_CARD_NUMBER.toString()))
            .andExpect(jsonPath("$.expirationMonth").value(DEFAULT_EXPIRATION_MONTH.toString()))
            .andExpect(jsonPath("$.expirationYear").value(DEFAULT_EXPIRATION_YEAR.toString()))
            .andExpect(jsonPath("$.cvc").value(DEFAULT_CVC.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCard() throws Exception {
        // Get the card
        restCardMockMvc.perform(get("/api/cards/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCard() throws Exception {
        // Initialize the database
        cardRepository.saveAndFlush(card);

        int databaseSizeBeforeUpdate = cardRepository.findAll().size();

        // Update the card
        Card updatedCard = cardRepository.findById(card.getId()).get();
        // Disconnect from session so that the updates on updatedCard are not directly saved in db
        em.detach(updatedCard);
        updatedCard
            .holderName(UPDATED_HOLDER_NAME)
            .cardNumber(UPDATED_CARD_NUMBER)
            .expirationMonth(UPDATED_EXPIRATION_MONTH)
            .expirationYear(UPDATED_EXPIRATION_YEAR)
            .cvc(UPDATED_CVC);

        restCardMockMvc.perform(put("/api/cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCard)))
            .andExpect(status().isOk());

        // Validate the Card in the database
        List<Card> cardList = cardRepository.findAll();
        assertThat(cardList).hasSize(databaseSizeBeforeUpdate);
        Card testCard = cardList.get(cardList.size() - 1);
        assertThat(testCard.getHolderName()).isEqualTo(UPDATED_HOLDER_NAME);
        assertThat(testCard.getCardNumber()).isEqualTo(UPDATED_CARD_NUMBER);
        assertThat(testCard.getExpirationMonth()).isEqualTo(UPDATED_EXPIRATION_MONTH);
        assertThat(testCard.getExpirationYear()).isEqualTo(UPDATED_EXPIRATION_YEAR);
        assertThat(testCard.getCvc()).isEqualTo(UPDATED_CVC);

        // Validate the Card in Elasticsearch
        verify(mockCardSearchRepository, times(1)).save(testCard);
    }

    @Test
    @Transactional
    public void updateNonExistingCard() throws Exception {
        int databaseSizeBeforeUpdate = cardRepository.findAll().size();

        // Create the Card

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCardMockMvc.perform(put("/api/cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(card)))
            .andExpect(status().isBadRequest());

        // Validate the Card in the database
        List<Card> cardList = cardRepository.findAll();
        assertThat(cardList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Card in Elasticsearch
        verify(mockCardSearchRepository, times(0)).save(card);
    }

    @Test
    @Transactional
    public void deleteCard() throws Exception {
        // Initialize the database
        cardRepository.saveAndFlush(card);

        int databaseSizeBeforeDelete = cardRepository.findAll().size();

        // Delete the card
        restCardMockMvc.perform(delete("/api/cards/{id}", card.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Card> cardList = cardRepository.findAll();
        assertThat(cardList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Card in Elasticsearch
        verify(mockCardSearchRepository, times(1)).deleteById(card.getId());
    }

    @Test
    @Transactional
    public void searchCard() throws Exception {
        // Initialize the database
        cardRepository.saveAndFlush(card);
        when(mockCardSearchRepository.search(queryStringQuery("id:" + card.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(card), PageRequest.of(0, 1), 1));
        // Search the card
        restCardMockMvc.perform(get("/api/_search/cards?query=id:" + card.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(card.getId().intValue())))
            .andExpect(jsonPath("$.[*].holderName").value(hasItem(DEFAULT_HOLDER_NAME)))
            .andExpect(jsonPath("$.[*].cardNumber").value(hasItem(DEFAULT_CARD_NUMBER)))
            .andExpect(jsonPath("$.[*].expirationMonth").value(hasItem(DEFAULT_EXPIRATION_MONTH)))
            .andExpect(jsonPath("$.[*].expirationYear").value(hasItem(DEFAULT_EXPIRATION_YEAR)))
            .andExpect(jsonPath("$.[*].cvc").value(hasItem(DEFAULT_CVC)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Card.class);
        Card card1 = new Card();
        card1.setId(1L);
        Card card2 = new Card();
        card2.setId(card1.getId());
        assertThat(card1).isEqualTo(card2);
        card2.setId(2L);
        assertThat(card1).isNotEqualTo(card2);
        card1.setId(null);
        assertThat(card1).isNotEqualTo(card2);
    }
}
