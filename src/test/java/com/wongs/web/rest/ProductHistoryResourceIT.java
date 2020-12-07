package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.ProductHistory;
import com.wongs.repository.ProductHistoryRepository;
import com.wongs.repository.search.ProductHistorySearchRepository;
import com.wongs.service.ProductHistoryService;
import com.wongs.service.dto.ProductHistoryDTO;
import com.wongs.service.mapper.ProductHistoryMapper;

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

import com.wongs.domain.enumeration.ProductStatus;
/**
 * Integration tests for the {@link ProductHistoryResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class ProductHistoryResourceIT {

    private static final Long DEFAULT_PRODUCT_ID = 1L;
    private static final Long UPDATED_PRODUCT_ID = 2L;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_BRAND = "AAAAAAAAAA";
    private static final String UPDATED_BRAND = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final String DEFAULT_REMARK = "AAAAAAAAAA";
    private static final String UPDATED_REMARK = "BBBBBBBBBB";

    private static final ProductStatus DEFAULT_STATUS = ProductStatus.ACTIVE;
    private static final ProductStatus UPDATED_STATUS = ProductStatus.RESTRICTED;

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private ProductHistoryRepository productHistoryRepository;

    @Autowired
    private ProductHistoryMapper productHistoryMapper;

    @Autowired
    private ProductHistoryService productHistoryService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.ProductHistorySearchRepositoryMockConfiguration
     */
    @Autowired
    private ProductHistorySearchRepository mockProductHistorySearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductHistoryMockMvc;

    private ProductHistory productHistory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductHistory createEntity(EntityManager em) {
        ProductHistory productHistory = new ProductHistory()
            .productId(DEFAULT_PRODUCT_ID)
            .name(DEFAULT_NAME)
            .code(DEFAULT_CODE)
            .brand(DEFAULT_BRAND)
            .description(DEFAULT_DESCRIPTION)
            .content(DEFAULT_CONTENT)
            .remark(DEFAULT_REMARK)
            .status(DEFAULT_STATUS)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE);
        return productHistory;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductHistory createUpdatedEntity(EntityManager em) {
        ProductHistory productHistory = new ProductHistory()
            .productId(UPDATED_PRODUCT_ID)
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .brand(UPDATED_BRAND)
            .description(UPDATED_DESCRIPTION)
            .content(UPDATED_CONTENT)
            .remark(UPDATED_REMARK)
            .status(UPDATED_STATUS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE);
        return productHistory;
    }

    @BeforeEach
    public void initTest() {
        productHistory = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductHistory() throws Exception {
        int databaseSizeBeforeCreate = productHistoryRepository.findAll().size();

        // Create the ProductHistory
        ProductHistoryDTO productHistoryDTO = productHistoryMapper.toDto(productHistory);
        restProductHistoryMockMvc.perform(post("/api/product-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productHistoryDTO)))
            .andExpect(status().isCreated());

        // Validate the ProductHistory in the database
        List<ProductHistory> productHistoryList = productHistoryRepository.findAll();
        assertThat(productHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        ProductHistory testProductHistory = productHistoryList.get(productHistoryList.size() - 1);
        assertThat(testProductHistory.getProductId()).isEqualTo(DEFAULT_PRODUCT_ID);
        assertThat(testProductHistory.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProductHistory.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testProductHistory.getBrand()).isEqualTo(DEFAULT_BRAND);
        assertThat(testProductHistory.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProductHistory.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testProductHistory.getRemark()).isEqualTo(DEFAULT_REMARK);
        assertThat(testProductHistory.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testProductHistory.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
        assertThat(testProductHistory.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);

        // Validate the ProductHistory in Elasticsearch
        verify(mockProductHistorySearchRepository, times(1)).save(testProductHistory);
    }

    @Test
    @Transactional
    public void createProductHistoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productHistoryRepository.findAll().size();

        // Create the ProductHistory with an existing ID
        productHistory.setId(1L);
        ProductHistoryDTO productHistoryDTO = productHistoryMapper.toDto(productHistory);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductHistoryMockMvc.perform(post("/api/product-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productHistoryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ProductHistory in the database
        List<ProductHistory> productHistoryList = productHistoryRepository.findAll();
        assertThat(productHistoryList).hasSize(databaseSizeBeforeCreate);

        // Validate the ProductHistory in Elasticsearch
        verify(mockProductHistorySearchRepository, times(0)).save(productHistory);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = productHistoryRepository.findAll().size();
        // set the field null
        productHistory.setName(null);

        // Create the ProductHistory, which fails.
        ProductHistoryDTO productHistoryDTO = productHistoryMapper.toDto(productHistory);

        restProductHistoryMockMvc.perform(post("/api/product-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productHistoryDTO)))
            .andExpect(status().isBadRequest());

        List<ProductHistory> productHistoryList = productHistoryRepository.findAll();
        assertThat(productHistoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllProductHistories() throws Exception {
        // Initialize the database
        productHistoryRepository.saveAndFlush(productHistory);

        // Get all the productHistoryList
        restProductHistoryMockMvc.perform(get("/api/product-histories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].productId").value(hasItem(DEFAULT_PRODUCT_ID.intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].brand").value(hasItem(DEFAULT_BRAND)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].remark").value(hasItem(DEFAULT_REMARK)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))));
    }
    
    @Test
    @Transactional
    public void getProductHistory() throws Exception {
        // Initialize the database
        productHistoryRepository.saveAndFlush(productHistory);

        // Get the productHistory
        restProductHistoryMockMvc.perform(get("/api/product-histories/{id}", productHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productHistory.getId().intValue()))
            .andExpect(jsonPath("$.productId").value(DEFAULT_PRODUCT_ID.intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.brand").value(DEFAULT_BRAND))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT))
            .andExpect(jsonPath("$.remark").value(DEFAULT_REMARK))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(sameInstant(DEFAULT_CREATED_DATE)));
    }

    @Test
    @Transactional
    public void getNonExistingProductHistory() throws Exception {
        // Get the productHistory
        restProductHistoryMockMvc.perform(get("/api/product-histories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProductHistory() throws Exception {
        // Initialize the database
        productHistoryRepository.saveAndFlush(productHistory);

        int databaseSizeBeforeUpdate = productHistoryRepository.findAll().size();

        // Update the productHistory
        ProductHistory updatedProductHistory = productHistoryRepository.findById(productHistory.getId()).get();
        // Disconnect from session so that the updates on updatedProductHistory are not directly saved in db
        em.detach(updatedProductHistory);
        updatedProductHistory
            .productId(UPDATED_PRODUCT_ID)
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .brand(UPDATED_BRAND)
            .description(UPDATED_DESCRIPTION)
            .content(UPDATED_CONTENT)
            .remark(UPDATED_REMARK)
            .status(UPDATED_STATUS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE);
        ProductHistoryDTO productHistoryDTO = productHistoryMapper.toDto(updatedProductHistory);

        restProductHistoryMockMvc.perform(put("/api/product-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productHistoryDTO)))
            .andExpect(status().isOk());

        // Validate the ProductHistory in the database
        List<ProductHistory> productHistoryList = productHistoryRepository.findAll();
        assertThat(productHistoryList).hasSize(databaseSizeBeforeUpdate);
        ProductHistory testProductHistory = productHistoryList.get(productHistoryList.size() - 1);
        assertThat(testProductHistory.getProductId()).isEqualTo(UPDATED_PRODUCT_ID);
        assertThat(testProductHistory.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProductHistory.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testProductHistory.getBrand()).isEqualTo(UPDATED_BRAND);
        assertThat(testProductHistory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProductHistory.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testProductHistory.getRemark()).isEqualTo(UPDATED_REMARK);
        assertThat(testProductHistory.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testProductHistory.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testProductHistory.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);

        // Validate the ProductHistory in Elasticsearch
        verify(mockProductHistorySearchRepository, times(1)).save(testProductHistory);
    }

    @Test
    @Transactional
    public void updateNonExistingProductHistory() throws Exception {
        int databaseSizeBeforeUpdate = productHistoryRepository.findAll().size();

        // Create the ProductHistory
        ProductHistoryDTO productHistoryDTO = productHistoryMapper.toDto(productHistory);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductHistoryMockMvc.perform(put("/api/product-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productHistoryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ProductHistory in the database
        List<ProductHistory> productHistoryList = productHistoryRepository.findAll();
        assertThat(productHistoryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ProductHistory in Elasticsearch
        verify(mockProductHistorySearchRepository, times(0)).save(productHistory);
    }

    @Test
    @Transactional
    public void deleteProductHistory() throws Exception {
        // Initialize the database
        productHistoryRepository.saveAndFlush(productHistory);

        int databaseSizeBeforeDelete = productHistoryRepository.findAll().size();

        // Delete the productHistory
        restProductHistoryMockMvc.perform(delete("/api/product-histories/{id}", productHistory.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductHistory> productHistoryList = productHistoryRepository.findAll();
        assertThat(productHistoryList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ProductHistory in Elasticsearch
        verify(mockProductHistorySearchRepository, times(1)).deleteById(productHistory.getId());
    }

    @Test
    @Transactional
    public void searchProductHistory() throws Exception {
        // Initialize the database
        productHistoryRepository.saveAndFlush(productHistory);
        when(mockProductHistorySearchRepository.search(queryStringQuery("id:" + productHistory.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(productHistory), PageRequest.of(0, 1), 1));
        // Search the productHistory
        restProductHistoryMockMvc.perform(get("/api/_search/product-histories?query=id:" + productHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].productId").value(hasItem(DEFAULT_PRODUCT_ID.intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].brand").value(hasItem(DEFAULT_BRAND)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].remark").value(hasItem(DEFAULT_REMARK)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))));
    }
}
