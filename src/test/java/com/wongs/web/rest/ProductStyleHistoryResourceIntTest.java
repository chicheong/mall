package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.ProductStyleHistory;
import com.wongs.repository.ProductStyleHistoryRepository;
import com.wongs.repository.search.ProductStyleHistorySearchRepository;
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

import com.wongs.domain.enumeration.ProductStyleType;
/**
 * Test class for the ProductStyleHistoryResource REST controller.
 *
 * @see ProductStyleHistoryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class ProductStyleHistoryResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_DEFAULT = false;
    private static final Boolean UPDATED_IS_DEFAULT = true;

    private static final ProductStyleType DEFAULT_TYPE = ProductStyleType.COLOR;
    private static final ProductStyleType UPDATED_TYPE = ProductStyleType.SIZE;

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private ProductStyleHistoryRepository productStyleHistoryRepository;

    @Autowired
    private ProductStyleHistorySearchRepository productStyleHistorySearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restProductStyleHistoryMockMvc;

    private ProductStyleHistory productStyleHistory;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductStyleHistoryResource productStyleHistoryResource = new ProductStyleHistoryResource(productStyleHistoryRepository, productStyleHistorySearchRepository);
        this.restProductStyleHistoryMockMvc = MockMvcBuilders.standaloneSetup(productStyleHistoryResource)
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
    public static ProductStyleHistory createEntity(EntityManager em) {
        ProductStyleHistory productStyleHistory = new ProductStyleHistory()
            .name(DEFAULT_NAME)
            .code(DEFAULT_CODE)
            .isDefault(DEFAULT_IS_DEFAULT)
            .type(DEFAULT_TYPE)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE);
        return productStyleHistory;
    }

    @Before
    public void initTest() {
        productStyleHistorySearchRepository.deleteAll();
        productStyleHistory = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductStyleHistory() throws Exception {
        int databaseSizeBeforeCreate = productStyleHistoryRepository.findAll().size();

        // Create the ProductStyleHistory
        restProductStyleHistoryMockMvc.perform(post("/api/product-style-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productStyleHistory)))
            .andExpect(status().isCreated());

        // Validate the ProductStyleHistory in the database
        List<ProductStyleHistory> productStyleHistoryList = productStyleHistoryRepository.findAll();
        assertThat(productStyleHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        ProductStyleHistory testProductStyleHistory = productStyleHistoryList.get(productStyleHistoryList.size() - 1);
        assertThat(testProductStyleHistory.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProductStyleHistory.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testProductStyleHistory.isIsDefault()).isEqualTo(DEFAULT_IS_DEFAULT);
        assertThat(testProductStyleHistory.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testProductStyleHistory.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
        assertThat(testProductStyleHistory.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);

        // Validate the ProductStyleHistory in Elasticsearch
        ProductStyleHistory productStyleHistoryEs = productStyleHistorySearchRepository.findOne(testProductStyleHistory.getId());
        assertThat(testProductStyleHistory.getCreatedDate()).isEqualTo(testProductStyleHistory.getCreatedDate());
        assertThat(productStyleHistoryEs).isEqualToIgnoringGivenFields(testProductStyleHistory, "createdDate");
    }

    @Test
    @Transactional
    public void createProductStyleHistoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productStyleHistoryRepository.findAll().size();

        // Create the ProductStyleHistory with an existing ID
        productStyleHistory.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductStyleHistoryMockMvc.perform(post("/api/product-style-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productStyleHistory)))
            .andExpect(status().isBadRequest());

        // Validate the ProductStyleHistory in the database
        List<ProductStyleHistory> productStyleHistoryList = productStyleHistoryRepository.findAll();
        assertThat(productStyleHistoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllProductStyleHistories() throws Exception {
        // Initialize the database
        productStyleHistoryRepository.saveAndFlush(productStyleHistory);

        // Get all the productStyleHistoryList
        restProductStyleHistoryMockMvc.perform(get("/api/product-style-histories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productStyleHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))));
    }

    @Test
    @Transactional
    public void getProductStyleHistory() throws Exception {
        // Initialize the database
        productStyleHistoryRepository.saveAndFlush(productStyleHistory);

        // Get the productStyleHistory
        restProductStyleHistoryMockMvc.perform(get("/api/product-style-histories/{id}", productStyleHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(productStyleHistory.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.isDefault").value(DEFAULT_IS_DEFAULT.booleanValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY.toString()))
            .andExpect(jsonPath("$.createdDate").value(sameInstant(DEFAULT_CREATED_DATE)));
    }

    @Test
    @Transactional
    public void getNonExistingProductStyleHistory() throws Exception {
        // Get the productStyleHistory
        restProductStyleHistoryMockMvc.perform(get("/api/product-style-histories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProductStyleHistory() throws Exception {
        // Initialize the database
        productStyleHistoryRepository.saveAndFlush(productStyleHistory);
        productStyleHistorySearchRepository.save(productStyleHistory);
        int databaseSizeBeforeUpdate = productStyleHistoryRepository.findAll().size();

        // Update the productStyleHistory
        ProductStyleHistory updatedProductStyleHistory = productStyleHistoryRepository.findOne(productStyleHistory.getId());
        // Disconnect from session so that the updates on updatedProductStyleHistory are not directly saved in db
        em.detach(updatedProductStyleHistory);
        updatedProductStyleHistory
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .isDefault(UPDATED_IS_DEFAULT)
            .type(UPDATED_TYPE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE);

        restProductStyleHistoryMockMvc.perform(put("/api/product-style-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProductStyleHistory)))
            .andExpect(status().isOk());

        // Validate the ProductStyleHistory in the database
        List<ProductStyleHistory> productStyleHistoryList = productStyleHistoryRepository.findAll();
        assertThat(productStyleHistoryList).hasSize(databaseSizeBeforeUpdate);
        ProductStyleHistory testProductStyleHistory = productStyleHistoryList.get(productStyleHistoryList.size() - 1);
        assertThat(testProductStyleHistory.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProductStyleHistory.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testProductStyleHistory.isIsDefault()).isEqualTo(UPDATED_IS_DEFAULT);
        assertThat(testProductStyleHistory.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testProductStyleHistory.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testProductStyleHistory.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);

        // Validate the ProductStyleHistory in Elasticsearch
        ProductStyleHistory productStyleHistoryEs = productStyleHistorySearchRepository.findOne(testProductStyleHistory.getId());
        assertThat(testProductStyleHistory.getCreatedDate()).isEqualTo(testProductStyleHistory.getCreatedDate());
        assertThat(productStyleHistoryEs).isEqualToIgnoringGivenFields(testProductStyleHistory, "createdDate");
    }

    @Test
    @Transactional
    public void updateNonExistingProductStyleHistory() throws Exception {
        int databaseSizeBeforeUpdate = productStyleHistoryRepository.findAll().size();

        // Create the ProductStyleHistory

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restProductStyleHistoryMockMvc.perform(put("/api/product-style-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productStyleHistory)))
            .andExpect(status().isCreated());

        // Validate the ProductStyleHistory in the database
        List<ProductStyleHistory> productStyleHistoryList = productStyleHistoryRepository.findAll();
        assertThat(productStyleHistoryList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteProductStyleHistory() throws Exception {
        // Initialize the database
        productStyleHistoryRepository.saveAndFlush(productStyleHistory);
        productStyleHistorySearchRepository.save(productStyleHistory);
        int databaseSizeBeforeDelete = productStyleHistoryRepository.findAll().size();

        // Get the productStyleHistory
        restProductStyleHistoryMockMvc.perform(delete("/api/product-style-histories/{id}", productStyleHistory.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean productStyleHistoryExistsInEs = productStyleHistorySearchRepository.exists(productStyleHistory.getId());
        assertThat(productStyleHistoryExistsInEs).isFalse();

        // Validate the database is empty
        List<ProductStyleHistory> productStyleHistoryList = productStyleHistoryRepository.findAll();
        assertThat(productStyleHistoryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchProductStyleHistory() throws Exception {
        // Initialize the database
        productStyleHistoryRepository.saveAndFlush(productStyleHistory);
        productStyleHistorySearchRepository.save(productStyleHistory);

        // Search the productStyleHistory
        restProductStyleHistoryMockMvc.perform(get("/api/_search/product-style-histories?query=id:" + productStyleHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productStyleHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductStyleHistory.class);
        ProductStyleHistory productStyleHistory1 = new ProductStyleHistory();
        productStyleHistory1.setId(1L);
        ProductStyleHistory productStyleHistory2 = new ProductStyleHistory();
        productStyleHistory2.setId(productStyleHistory1.getId());
        assertThat(productStyleHistory1).isEqualTo(productStyleHistory2);
        productStyleHistory2.setId(2L);
        assertThat(productStyleHistory1).isNotEqualTo(productStyleHistory2);
        productStyleHistory1.setId(null);
        assertThat(productStyleHistory1).isNotEqualTo(productStyleHistory2);
    }
}
