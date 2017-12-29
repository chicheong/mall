package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.ProductItemHistory;
import com.wongs.repository.ProductItemHistoryRepository;
import com.wongs.repository.search.ProductItemHistorySearchRepository;
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
/**
 * Test class for the ProductItemHistoryResource REST controller.
 *
 * @see ProductItemHistoryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class ProductItemHistoryResourceIntTest {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_DEFAULT = false;
    private static final Boolean UPDATED_IS_DEFAULT = true;

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final CurrencyType DEFAULT_CURRENCY = CurrencyType.HKD;
    private static final CurrencyType UPDATED_CURRENCY = CurrencyType.CNY;

    private static final BigDecimal DEFAULT_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICE = new BigDecimal(2);

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private ProductItemHistoryRepository productItemHistoryRepository;

    @Autowired
    private ProductItemHistorySearchRepository productItemHistorySearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restProductItemHistoryMockMvc;

    private ProductItemHistory productItemHistory;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductItemHistoryResource productItemHistoryResource = new ProductItemHistoryResource(productItemHistoryRepository, productItemHistorySearchRepository);
        this.restProductItemHistoryMockMvc = MockMvcBuilders.standaloneSetup(productItemHistoryResource)
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
    public static ProductItemHistory createEntity(EntityManager em) {
        ProductItemHistory productItemHistory = new ProductItemHistory()
            .code(DEFAULT_CODE)
            .isDefault(DEFAULT_IS_DEFAULT)
            .quantity(DEFAULT_QUANTITY)
            .currency(DEFAULT_CURRENCY)
            .price(DEFAULT_PRICE)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE);
        return productItemHistory;
    }

    @Before
    public void initTest() {
        productItemHistorySearchRepository.deleteAll();
        productItemHistory = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductItemHistory() throws Exception {
        int databaseSizeBeforeCreate = productItemHistoryRepository.findAll().size();

        // Create the ProductItemHistory
        restProductItemHistoryMockMvc.perform(post("/api/product-item-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productItemHistory)))
            .andExpect(status().isCreated());

        // Validate the ProductItemHistory in the database
        List<ProductItemHistory> productItemHistoryList = productItemHistoryRepository.findAll();
        assertThat(productItemHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        ProductItemHistory testProductItemHistory = productItemHistoryList.get(productItemHistoryList.size() - 1);
        assertThat(testProductItemHistory.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testProductItemHistory.isIsDefault()).isEqualTo(DEFAULT_IS_DEFAULT);
        assertThat(testProductItemHistory.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testProductItemHistory.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testProductItemHistory.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testProductItemHistory.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
        assertThat(testProductItemHistory.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);

        // Validate the ProductItemHistory in Elasticsearch
        ProductItemHistory productItemHistoryEs = productItemHistorySearchRepository.findOne(testProductItemHistory.getId());
        assertThat(testProductItemHistory.getCreatedDate()).isEqualTo(testProductItemHistory.getCreatedDate());
        assertThat(productItemHistoryEs).isEqualToIgnoringGivenFields(testProductItemHistory, "createdDate");
    }

    @Test
    @Transactional
    public void createProductItemHistoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productItemHistoryRepository.findAll().size();

        // Create the ProductItemHistory with an existing ID
        productItemHistory.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductItemHistoryMockMvc.perform(post("/api/product-item-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productItemHistory)))
            .andExpect(status().isBadRequest());

        // Validate the ProductItemHistory in the database
        List<ProductItemHistory> productItemHistoryList = productItemHistoryRepository.findAll();
        assertThat(productItemHistoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllProductItemHistories() throws Exception {
        // Initialize the database
        productItemHistoryRepository.saveAndFlush(productItemHistory);

        // Get all the productItemHistoryList
        restProductItemHistoryMockMvc.perform(get("/api/product-item-histories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productItemHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))));
    }

    @Test
    @Transactional
    public void getProductItemHistory() throws Exception {
        // Initialize the database
        productItemHistoryRepository.saveAndFlush(productItemHistory);

        // Get the productItemHistory
        restProductItemHistoryMockMvc.perform(get("/api/product-item-histories/{id}", productItemHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(productItemHistory.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.isDefault").value(DEFAULT_IS_DEFAULT.booleanValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.intValue()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY.toString()))
            .andExpect(jsonPath("$.createdDate").value(sameInstant(DEFAULT_CREATED_DATE)));
    }

    @Test
    @Transactional
    public void getNonExistingProductItemHistory() throws Exception {
        // Get the productItemHistory
        restProductItemHistoryMockMvc.perform(get("/api/product-item-histories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProductItemHistory() throws Exception {
        // Initialize the database
        productItemHistoryRepository.saveAndFlush(productItemHistory);
        productItemHistorySearchRepository.save(productItemHistory);
        int databaseSizeBeforeUpdate = productItemHistoryRepository.findAll().size();

        // Update the productItemHistory
        ProductItemHistory updatedProductItemHistory = productItemHistoryRepository.findOne(productItemHistory.getId());
        // Disconnect from session so that the updates on updatedProductItemHistory are not directly saved in db
        em.detach(updatedProductItemHistory);
        updatedProductItemHistory
            .code(UPDATED_CODE)
            .isDefault(UPDATED_IS_DEFAULT)
            .quantity(UPDATED_QUANTITY)
            .currency(UPDATED_CURRENCY)
            .price(UPDATED_PRICE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE);

        restProductItemHistoryMockMvc.perform(put("/api/product-item-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProductItemHistory)))
            .andExpect(status().isOk());

        // Validate the ProductItemHistory in the database
        List<ProductItemHistory> productItemHistoryList = productItemHistoryRepository.findAll();
        assertThat(productItemHistoryList).hasSize(databaseSizeBeforeUpdate);
        ProductItemHistory testProductItemHistory = productItemHistoryList.get(productItemHistoryList.size() - 1);
        assertThat(testProductItemHistory.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testProductItemHistory.isIsDefault()).isEqualTo(UPDATED_IS_DEFAULT);
        assertThat(testProductItemHistory.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testProductItemHistory.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testProductItemHistory.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testProductItemHistory.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testProductItemHistory.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);

        // Validate the ProductItemHistory in Elasticsearch
        ProductItemHistory productItemHistoryEs = productItemHistorySearchRepository.findOne(testProductItemHistory.getId());
        assertThat(testProductItemHistory.getCreatedDate()).isEqualTo(testProductItemHistory.getCreatedDate());
        assertThat(productItemHistoryEs).isEqualToIgnoringGivenFields(testProductItemHistory, "createdDate");
    }

    @Test
    @Transactional
    public void updateNonExistingProductItemHistory() throws Exception {
        int databaseSizeBeforeUpdate = productItemHistoryRepository.findAll().size();

        // Create the ProductItemHistory

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restProductItemHistoryMockMvc.perform(put("/api/product-item-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productItemHistory)))
            .andExpect(status().isCreated());

        // Validate the ProductItemHistory in the database
        List<ProductItemHistory> productItemHistoryList = productItemHistoryRepository.findAll();
        assertThat(productItemHistoryList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteProductItemHistory() throws Exception {
        // Initialize the database
        productItemHistoryRepository.saveAndFlush(productItemHistory);
        productItemHistorySearchRepository.save(productItemHistory);
        int databaseSizeBeforeDelete = productItemHistoryRepository.findAll().size();

        // Get the productItemHistory
        restProductItemHistoryMockMvc.perform(delete("/api/product-item-histories/{id}", productItemHistory.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean productItemHistoryExistsInEs = productItemHistorySearchRepository.exists(productItemHistory.getId());
        assertThat(productItemHistoryExistsInEs).isFalse();

        // Validate the database is empty
        List<ProductItemHistory> productItemHistoryList = productItemHistoryRepository.findAll();
        assertThat(productItemHistoryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchProductItemHistory() throws Exception {
        // Initialize the database
        productItemHistoryRepository.saveAndFlush(productItemHistory);
        productItemHistorySearchRepository.save(productItemHistory);

        // Search the productItemHistory
        restProductItemHistoryMockMvc.perform(get("/api/_search/product-item-histories?query=id:" + productItemHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productItemHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductItemHistory.class);
        ProductItemHistory productItemHistory1 = new ProductItemHistory();
        productItemHistory1.setId(1L);
        ProductItemHistory productItemHistory2 = new ProductItemHistory();
        productItemHistory2.setId(productItemHistory1.getId());
        assertThat(productItemHistory1).isEqualTo(productItemHistory2);
        productItemHistory2.setId(2L);
        assertThat(productItemHistory1).isNotEqualTo(productItemHistory2);
        productItemHistory1.setId(null);
        assertThat(productItemHistory1).isNotEqualTo(productItemHistory2);
    }
}
