package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.ProductItem;
import com.wongs.repository.ProductItemRepository;
import com.wongs.repository.search.ProductItemSearchRepository;
import com.wongs.service.ProductItemService;
import com.wongs.service.dto.ProductItemDTO;
import com.wongs.service.mapper.ProductItemMapper;

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
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wongs.domain.enumeration.CurrencyType;
/**
 * Integration tests for the {@link ProductItemResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class ProductItemResourceIT {

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

    @Autowired
    private ProductItemRepository productItemRepository;

    @Autowired
    private ProductItemMapper productItemMapper;

    @Autowired
    private ProductItemService productItemService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.ProductItemSearchRepositoryMockConfiguration
     */
    @Autowired
    private ProductItemSearchRepository mockProductItemSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductItemMockMvc;

    private ProductItem productItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductItem createEntity(EntityManager em) {
        ProductItem productItem = new ProductItem()
            .code(DEFAULT_CODE)
            .isDefault(DEFAULT_IS_DEFAULT)
            .quantity(DEFAULT_QUANTITY)
            .currency(DEFAULT_CURRENCY)
            .price(DEFAULT_PRICE);
        return productItem;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductItem createUpdatedEntity(EntityManager em) {
        ProductItem productItem = new ProductItem()
            .code(UPDATED_CODE)
            .isDefault(UPDATED_IS_DEFAULT)
            .quantity(UPDATED_QUANTITY)
            .currency(UPDATED_CURRENCY)
            .price(UPDATED_PRICE);
        return productItem;
    }

    @BeforeEach
    public void initTest() {
        productItem = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductItem() throws Exception {
        int databaseSizeBeforeCreate = productItemRepository.findAll().size();

        // Create the ProductItem
        ProductItemDTO productItemDTO = productItemMapper.toDto(productItem);
        restProductItemMockMvc.perform(post("/api/product-items")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productItemDTO)))
            .andExpect(status().isCreated());

        // Validate the ProductItem in the database
        List<ProductItem> productItemList = productItemRepository.findAll();
        assertThat(productItemList).hasSize(databaseSizeBeforeCreate + 1);
        ProductItem testProductItem = productItemList.get(productItemList.size() - 1);
        assertThat(testProductItem.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testProductItem.isIsDefault()).isEqualTo(DEFAULT_IS_DEFAULT);
        assertThat(testProductItem.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testProductItem.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testProductItem.getPrice()).isEqualTo(DEFAULT_PRICE);

        // Validate the ProductItem in Elasticsearch
        verify(mockProductItemSearchRepository, times(1)).save(testProductItem);
    }

    @Test
    @Transactional
    public void createProductItemWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productItemRepository.findAll().size();

        // Create the ProductItem with an existing ID
        productItem.setId(1L);
        ProductItemDTO productItemDTO = productItemMapper.toDto(productItem);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductItemMockMvc.perform(post("/api/product-items")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productItemDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ProductItem in the database
        List<ProductItem> productItemList = productItemRepository.findAll();
        assertThat(productItemList).hasSize(databaseSizeBeforeCreate);

        // Validate the ProductItem in Elasticsearch
        verify(mockProductItemSearchRepository, times(0)).save(productItem);
    }


    @Test
    @Transactional
    public void getAllProductItems() throws Exception {
        // Initialize the database
        productItemRepository.saveAndFlush(productItem);

        // Get all the productItemList
        restProductItemMockMvc.perform(get("/api/product-items?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())));
    }
    
    @Test
    @Transactional
    public void getProductItem() throws Exception {
        // Initialize the database
        productItemRepository.saveAndFlush(productItem);

        // Get the productItem
        restProductItemMockMvc.perform(get("/api/product-items/{id}", productItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productItem.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.isDefault").value(DEFAULT_IS_DEFAULT.booleanValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingProductItem() throws Exception {
        // Get the productItem
        restProductItemMockMvc.perform(get("/api/product-items/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProductItem() throws Exception {
        // Initialize the database
        productItemRepository.saveAndFlush(productItem);

        int databaseSizeBeforeUpdate = productItemRepository.findAll().size();

        // Update the productItem
        ProductItem updatedProductItem = productItemRepository.findById(productItem.getId()).get();
        // Disconnect from session so that the updates on updatedProductItem are not directly saved in db
        em.detach(updatedProductItem);
        updatedProductItem
            .code(UPDATED_CODE)
            .isDefault(UPDATED_IS_DEFAULT)
            .quantity(UPDATED_QUANTITY)
            .currency(UPDATED_CURRENCY)
            .price(UPDATED_PRICE);
        ProductItemDTO productItemDTO = productItemMapper.toDto(updatedProductItem);

        restProductItemMockMvc.perform(put("/api/product-items")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productItemDTO)))
            .andExpect(status().isOk());

        // Validate the ProductItem in the database
        List<ProductItem> productItemList = productItemRepository.findAll();
        assertThat(productItemList).hasSize(databaseSizeBeforeUpdate);
        ProductItem testProductItem = productItemList.get(productItemList.size() - 1);
        assertThat(testProductItem.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testProductItem.isIsDefault()).isEqualTo(UPDATED_IS_DEFAULT);
        assertThat(testProductItem.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testProductItem.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testProductItem.getPrice()).isEqualTo(UPDATED_PRICE);

        // Validate the ProductItem in Elasticsearch
        verify(mockProductItemSearchRepository, times(1)).save(testProductItem);
    }

    @Test
    @Transactional
    public void updateNonExistingProductItem() throws Exception {
        int databaseSizeBeforeUpdate = productItemRepository.findAll().size();

        // Create the ProductItem
        ProductItemDTO productItemDTO = productItemMapper.toDto(productItem);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductItemMockMvc.perform(put("/api/product-items")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(productItemDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ProductItem in the database
        List<ProductItem> productItemList = productItemRepository.findAll();
        assertThat(productItemList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ProductItem in Elasticsearch
        verify(mockProductItemSearchRepository, times(0)).save(productItem);
    }

    @Test
    @Transactional
    public void deleteProductItem() throws Exception {
        // Initialize the database
        productItemRepository.saveAndFlush(productItem);

        int databaseSizeBeforeDelete = productItemRepository.findAll().size();

        // Delete the productItem
        restProductItemMockMvc.perform(delete("/api/product-items/{id}", productItem.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductItem> productItemList = productItemRepository.findAll();
        assertThat(productItemList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ProductItem in Elasticsearch
        verify(mockProductItemSearchRepository, times(1)).deleteById(productItem.getId());
    }

    @Test
    @Transactional
    public void searchProductItem() throws Exception {
        // Initialize the database
        productItemRepository.saveAndFlush(productItem);
        when(mockProductItemSearchRepository.search(queryStringQuery("id:" + productItem.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(productItem), PageRequest.of(0, 1), 1));
        // Search the productItem
        restProductItemMockMvc.perform(get("/api/_search/product-items?query=id:" + productItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())));
    }
}
