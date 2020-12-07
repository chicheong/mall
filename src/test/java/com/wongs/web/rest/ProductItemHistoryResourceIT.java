package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.ProductItemHistory;
import com.wongs.repository.ProductItemHistoryRepository;
import com.wongs.repository.search.ProductItemHistorySearchRepository;
import com.wongs.service.ProductItemHistoryService;
import com.wongs.service.dto.ProductItemHistoryDTO;
import com.wongs.service.mapper.ProductItemHistoryMapper;

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
import java.math.BigDecimal;
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

import com.wongs.domain.enumeration.CurrencyType;
/**
 * Integration tests for the {@link ProductItemHistoryResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class ProductItemHistoryResourceIT {

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
    private ProductItemHistoryMapper productItemHistoryMapper;

    @Autowired
    private ProductItemHistoryService productItemHistoryService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.ProductItemHistorySearchRepositoryMockConfiguration
     */
    @Autowired
    private ProductItemHistorySearchRepository mockProductItemHistorySearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductItemHistoryMockMvc;

    private ProductItemHistory productItemHistory;

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
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductItemHistory createUpdatedEntity(EntityManager em) {
        ProductItemHistory productItemHistory = new ProductItemHistory()
            .code(UPDATED_CODE)
            .isDefault(UPDATED_IS_DEFAULT)
            .quantity(UPDATED_QUANTITY)
            .currency(UPDATED_CURRENCY)
            .price(UPDATED_PRICE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE);
        return productItemHistory;
    }

    @BeforeEach
    public void initTest() {
        productItemHistory = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductItemHistory() throws Exception {
        int databaseSizeBeforeCreate = productItemHistoryRepository.findAll().size();

        // Create the ProductItemHistory
        ProductItemHistoryDTO productItemHistoryDTO = productItemHistoryMapper.toDto(productItemHistory);
        restProductItemHistoryMockMvc.perform(post("/api/product-item-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productItemHistoryDTO)))
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
        verify(mockProductItemHistorySearchRepository, times(1)).save(testProductItemHistory);
    }

    @Test
    @Transactional
    public void createProductItemHistoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productItemHistoryRepository.findAll().size();

        // Create the ProductItemHistory with an existing ID
        productItemHistory.setId(1L);
        ProductItemHistoryDTO productItemHistoryDTO = productItemHistoryMapper.toDto(productItemHistory);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductItemHistoryMockMvc.perform(post("/api/product-item-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productItemHistoryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ProductItemHistory in the database
        List<ProductItemHistory> productItemHistoryList = productItemHistoryRepository.findAll();
        assertThat(productItemHistoryList).hasSize(databaseSizeBeforeCreate);

        // Validate the ProductItemHistory in Elasticsearch
        verify(mockProductItemHistorySearchRepository, times(0)).save(productItemHistory);
    }


    @Test
    @Transactional
    public void getAllProductItemHistories() throws Exception {
        // Initialize the database
        productItemHistoryRepository.saveAndFlush(productItemHistory);

        // Get all the productItemHistoryList
        restProductItemHistoryMockMvc.perform(get("/api/product-item-histories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productItemHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productItemHistory.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.isDefault").value(DEFAULT_IS_DEFAULT.booleanValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.intValue()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
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

        int databaseSizeBeforeUpdate = productItemHistoryRepository.findAll().size();

        // Update the productItemHistory
        ProductItemHistory updatedProductItemHistory = productItemHistoryRepository.findById(productItemHistory.getId()).get();
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
        ProductItemHistoryDTO productItemHistoryDTO = productItemHistoryMapper.toDto(updatedProductItemHistory);

        restProductItemHistoryMockMvc.perform(put("/api/product-item-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productItemHistoryDTO)))
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
        verify(mockProductItemHistorySearchRepository, times(1)).save(testProductItemHistory);
    }

    @Test
    @Transactional
    public void updateNonExistingProductItemHistory() throws Exception {
        int databaseSizeBeforeUpdate = productItemHistoryRepository.findAll().size();

        // Create the ProductItemHistory
        ProductItemHistoryDTO productItemHistoryDTO = productItemHistoryMapper.toDto(productItemHistory);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductItemHistoryMockMvc.perform(put("/api/product-item-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productItemHistoryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ProductItemHistory in the database
        List<ProductItemHistory> productItemHistoryList = productItemHistoryRepository.findAll();
        assertThat(productItemHistoryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ProductItemHistory in Elasticsearch
        verify(mockProductItemHistorySearchRepository, times(0)).save(productItemHistory);
    }

    @Test
    @Transactional
    public void deleteProductItemHistory() throws Exception {
        // Initialize the database
        productItemHistoryRepository.saveAndFlush(productItemHistory);

        int databaseSizeBeforeDelete = productItemHistoryRepository.findAll().size();

        // Delete the productItemHistory
        restProductItemHistoryMockMvc.perform(delete("/api/product-item-histories/{id}", productItemHistory.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductItemHistory> productItemHistoryList = productItemHistoryRepository.findAll();
        assertThat(productItemHistoryList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ProductItemHistory in Elasticsearch
        verify(mockProductItemHistorySearchRepository, times(1)).deleteById(productItemHistory.getId());
    }

    @Test
    @Transactional
    public void searchProductItemHistory() throws Exception {
        // Initialize the database
        productItemHistoryRepository.saveAndFlush(productItemHistory);
        when(mockProductItemHistorySearchRepository.search(queryStringQuery("id:" + productItemHistory.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(productItemHistory), PageRequest.of(0, 1), 1));
        // Search the productItemHistory
        restProductItemHistoryMockMvc.perform(get("/api/_search/product-item-histories?query=id:" + productItemHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productItemHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))));
    }
}
