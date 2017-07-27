package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.Price;
import com.wongs.repository.PriceRepository;
import com.wongs.repository.search.PriceSearchRepository;
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
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wongs.domain.enumeration.CurrencyType;
/**
 * Test class for the PriceResource REST controller.
 *
 * @see PriceResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class PriceResourceIntTest {

    private static final ZonedDateTime DEFAULT_FROM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_FROM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_TO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final BigDecimal DEFAULT_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICE = new BigDecimal(2);

    private static final CurrencyType DEFAULT_CURRENCY = CurrencyType.HKD;
    private static final CurrencyType UPDATED_CURRENCY = CurrencyType.CNY;

    @Autowired
    private PriceRepository priceRepository;

    @Autowired
    private PriceSearchRepository priceSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPriceMockMvc;

    private Price price;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        PriceResource priceResource = new PriceResource(priceRepository, priceSearchRepository);
        this.restPriceMockMvc = MockMvcBuilders.standaloneSetup(priceResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Price createEntity(EntityManager em) {
        Price price = new Price()
            .from(DEFAULT_FROM)
            .to(DEFAULT_TO)
            .price(DEFAULT_PRICE)
            .currency(DEFAULT_CURRENCY);
        return price;
    }

    @Before
    public void initTest() {
        priceSearchRepository.deleteAll();
        price = createEntity(em);
    }

    @Test
    @Transactional
    public void createPrice() throws Exception {
        int databaseSizeBeforeCreate = priceRepository.findAll().size();

        // Create the Price
        restPriceMockMvc.perform(post("/api/prices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(price)))
            .andExpect(status().isCreated());

        // Validate the Price in the database
        List<Price> priceList = priceRepository.findAll();
        assertThat(priceList).hasSize(databaseSizeBeforeCreate + 1);
        Price testPrice = priceList.get(priceList.size() - 1);
        assertThat(testPrice.getFrom()).isEqualTo(DEFAULT_FROM);
        assertThat(testPrice.getTo()).isEqualTo(DEFAULT_TO);
        assertThat(testPrice.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testPrice.getCurrency()).isEqualTo(DEFAULT_CURRENCY);

        // Validate the Price in Elasticsearch
        Price priceEs = priceSearchRepository.findOne(testPrice.getId());
        assertThat(priceEs).isEqualToComparingFieldByField(testPrice);
    }

    @Test
    @Transactional
    public void createPriceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = priceRepository.findAll().size();

        // Create the Price with an existing ID
        price.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPriceMockMvc.perform(post("/api/prices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(price)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Price> priceList = priceRepository.findAll();
        assertThat(priceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllPrices() throws Exception {
        // Initialize the database
        priceRepository.saveAndFlush(price);

        // Get all the priceList
        restPriceMockMvc.perform(get("/api/prices?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(price.getId().intValue())))
            .andExpect(jsonPath("$.[*].from").value(hasItem(sameInstant(DEFAULT_FROM))))
            .andExpect(jsonPath("$.[*].to").value(hasItem(sameInstant(DEFAULT_TO))))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())));
    }

    @Test
    @Transactional
    public void getPrice() throws Exception {
        // Initialize the database
        priceRepository.saveAndFlush(price);

        // Get the price
        restPriceMockMvc.perform(get("/api/prices/{id}", price.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(price.getId().intValue()))
            .andExpect(jsonPath("$.from").value(sameInstant(DEFAULT_FROM)))
            .andExpect(jsonPath("$.to").value(sameInstant(DEFAULT_TO)))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.intValue()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPrice() throws Exception {
        // Get the price
        restPriceMockMvc.perform(get("/api/prices/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePrice() throws Exception {
        // Initialize the database
        priceRepository.saveAndFlush(price);
        priceSearchRepository.save(price);
        int databaseSizeBeforeUpdate = priceRepository.findAll().size();

        // Update the price
        Price updatedPrice = priceRepository.findOne(price.getId());
        updatedPrice
            .from(UPDATED_FROM)
            .to(UPDATED_TO)
            .price(UPDATED_PRICE)
            .currency(UPDATED_CURRENCY);

        restPriceMockMvc.perform(put("/api/prices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPrice)))
            .andExpect(status().isOk());

        // Validate the Price in the database
        List<Price> priceList = priceRepository.findAll();
        assertThat(priceList).hasSize(databaseSizeBeforeUpdate);
        Price testPrice = priceList.get(priceList.size() - 1);
        assertThat(testPrice.getFrom()).isEqualTo(UPDATED_FROM);
        assertThat(testPrice.getTo()).isEqualTo(UPDATED_TO);
        assertThat(testPrice.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testPrice.getCurrency()).isEqualTo(UPDATED_CURRENCY);

        // Validate the Price in Elasticsearch
        Price priceEs = priceSearchRepository.findOne(testPrice.getId());
        assertThat(priceEs).isEqualToComparingFieldByField(testPrice);
    }

    @Test
    @Transactional
    public void updateNonExistingPrice() throws Exception {
        int databaseSizeBeforeUpdate = priceRepository.findAll().size();

        // Create the Price

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPriceMockMvc.perform(put("/api/prices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(price)))
            .andExpect(status().isCreated());

        // Validate the Price in the database
        List<Price> priceList = priceRepository.findAll();
        assertThat(priceList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePrice() throws Exception {
        // Initialize the database
        priceRepository.saveAndFlush(price);
        priceSearchRepository.save(price);
        int databaseSizeBeforeDelete = priceRepository.findAll().size();

        // Get the price
        restPriceMockMvc.perform(delete("/api/prices/{id}", price.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean priceExistsInEs = priceSearchRepository.exists(price.getId());
        assertThat(priceExistsInEs).isFalse();

        // Validate the database is empty
        List<Price> priceList = priceRepository.findAll();
        assertThat(priceList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPrice() throws Exception {
        // Initialize the database
        priceRepository.saveAndFlush(price);
        priceSearchRepository.save(price);

        // Search the price
        restPriceMockMvc.perform(get("/api/_search/prices?query=id:" + price.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(price.getId().intValue())))
            .andExpect(jsonPath("$.[*].from").value(hasItem(sameInstant(DEFAULT_FROM))))
            .andExpect(jsonPath("$.[*].to").value(hasItem(sameInstant(DEFAULT_TO))))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Price.class);
        Price price1 = new Price();
        price1.setId(1L);
        Price price2 = new Price();
        price2.setId(price1.getId());
        assertThat(price1).isEqualTo(price2);
        price2.setId(2L);
        assertThat(price1).isNotEqualTo(price2);
        price1.setId(null);
        assertThat(price1).isNotEqualTo(price2);
    }
}
