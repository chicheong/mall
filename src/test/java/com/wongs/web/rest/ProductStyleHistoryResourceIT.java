package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.ProductStyleHistory;
import com.wongs.repository.ProductStyleHistoryRepository;
import com.wongs.repository.search.ProductStyleHistorySearchRepository;
import com.wongs.service.ProductStyleHistoryService;
import com.wongs.service.dto.ProductStyleHistoryDTO;
import com.wongs.service.mapper.ProductStyleHistoryMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
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

import com.wongs.domain.enumeration.ProductStyleType;
/**
 * Integration tests for the {@link ProductStyleHistoryResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class ProductStyleHistoryResourceIT {

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
    private ProductStyleHistoryMapper productStyleHistoryMapper;

    @Autowired
    private ProductStyleHistoryService productStyleHistoryService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.ProductStyleHistorySearchRepositoryMockConfiguration
     */
    @Autowired
    private ProductStyleHistorySearchRepository mockProductStyleHistorySearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductStyleHistoryMockMvc;

    private ProductStyleHistory productStyleHistory;

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
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductStyleHistory createUpdatedEntity(EntityManager em) {
        ProductStyleHistory productStyleHistory = new ProductStyleHistory()
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .isDefault(UPDATED_IS_DEFAULT)
            .type(UPDATED_TYPE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE);
        return productStyleHistory;
    }

    @BeforeEach
    public void initTest() {
        productStyleHistory = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductStyleHistory() throws Exception {
        int databaseSizeBeforeCreate = productStyleHistoryRepository.findAll().size();

        // Create the ProductStyleHistory
        ProductStyleHistoryDTO productStyleHistoryDTO = productStyleHistoryMapper.toDto(productStyleHistory);
        restProductStyleHistoryMockMvc.perform(post("/api/product-style-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productStyleHistoryDTO)))
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
        verify(mockProductStyleHistorySearchRepository, times(1)).save(testProductStyleHistory);
    }

    @Test
    @Transactional
    public void createProductStyleHistoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productStyleHistoryRepository.findAll().size();

        // Create the ProductStyleHistory with an existing ID
        productStyleHistory.setId(1L);
        ProductStyleHistoryDTO productStyleHistoryDTO = productStyleHistoryMapper.toDto(productStyleHistory);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductStyleHistoryMockMvc.perform(post("/api/product-style-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productStyleHistoryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ProductStyleHistory in the database
        List<ProductStyleHistory> productStyleHistoryList = productStyleHistoryRepository.findAll();
        assertThat(productStyleHistoryList).hasSize(databaseSizeBeforeCreate);

        // Validate the ProductStyleHistory in Elasticsearch
        verify(mockProductStyleHistorySearchRepository, times(0)).save(productStyleHistory);
    }


    @Test
    @Transactional
    public void getAllProductStyleHistories() throws Exception {
        // Initialize the database
        productStyleHistoryRepository.saveAndFlush(productStyleHistory);

        // Get all the productStyleHistoryList
        restProductStyleHistoryMockMvc.perform(get("/api/product-style-histories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productStyleHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productStyleHistory.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.isDefault").value(DEFAULT_IS_DEFAULT.booleanValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
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

        int databaseSizeBeforeUpdate = productStyleHistoryRepository.findAll().size();

        // Update the productStyleHistory
        ProductStyleHistory updatedProductStyleHistory = productStyleHistoryRepository.findById(productStyleHistory.getId()).get();
        // Disconnect from session so that the updates on updatedProductStyleHistory are not directly saved in db
        em.detach(updatedProductStyleHistory);
        updatedProductStyleHistory
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .isDefault(UPDATED_IS_DEFAULT)
            .type(UPDATED_TYPE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE);
        ProductStyleHistoryDTO productStyleHistoryDTO = productStyleHistoryMapper.toDto(updatedProductStyleHistory);

        restProductStyleHistoryMockMvc.perform(put("/api/product-style-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productStyleHistoryDTO)))
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
        verify(mockProductStyleHistorySearchRepository, times(1)).save(testProductStyleHistory);
    }

    @Test
    @Transactional
    public void updateNonExistingProductStyleHistory() throws Exception {
        int databaseSizeBeforeUpdate = productStyleHistoryRepository.findAll().size();

        // Create the ProductStyleHistory
        ProductStyleHistoryDTO productStyleHistoryDTO = productStyleHistoryMapper.toDto(productStyleHistory);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductStyleHistoryMockMvc.perform(put("/api/product-style-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productStyleHistoryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ProductStyleHistory in the database
        List<ProductStyleHistory> productStyleHistoryList = productStyleHistoryRepository.findAll();
        assertThat(productStyleHistoryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ProductStyleHistory in Elasticsearch
        verify(mockProductStyleHistorySearchRepository, times(0)).save(productStyleHistory);
    }

    @Test
    @Transactional
    public void deleteProductStyleHistory() throws Exception {
        // Initialize the database
        productStyleHistoryRepository.saveAndFlush(productStyleHistory);

        int databaseSizeBeforeDelete = productStyleHistoryRepository.findAll().size();

        // Delete the productStyleHistory
        restProductStyleHistoryMockMvc.perform(delete("/api/product-style-histories/{id}", productStyleHistory.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductStyleHistory> productStyleHistoryList = productStyleHistoryRepository.findAll();
        assertThat(productStyleHistoryList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ProductStyleHistory in Elasticsearch
        verify(mockProductStyleHistorySearchRepository, times(1)).deleteById(productStyleHistory.getId());
    }

    @Test
    @Transactional
    public void searchProductStyleHistory() throws Exception {
        // Initialize the database
        productStyleHistoryRepository.saveAndFlush(productStyleHistory);
        when(mockProductStyleHistorySearchRepository.search(queryStringQuery("id:" + productStyleHistory.getId())))
            .thenReturn(Collections.singletonList(productStyleHistory));
        // Search the productStyleHistory
        restProductStyleHistoryMockMvc.perform(get("/api/_search/product-style-histories?query=id:" + productStyleHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productStyleHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))));
    }
}
