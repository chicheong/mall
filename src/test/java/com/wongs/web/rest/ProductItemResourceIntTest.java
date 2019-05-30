package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.ProductItem;
import com.wongs.repository.ProductItemRepository;
import com.wongs.repository.search.ProductItemSearchRepository;
import com.wongs.service.dto.ProductItemDTO;
import com.wongs.service.mapper.ProductItemMapper;
import com.wongs.service.mapper.PriceMapper;
import com.wongs.service.mapper.QuantityMapper;
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
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;


import static com.wongs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wongs.domain.enumeration.CurrencyType;
/**
 * Test class for the ProductItemResource REST controller.
 *
 * @see ProductItemResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class ProductItemResourceIntTest {

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
    private PriceMapper priceMapper;
    
    @Autowired
    private QuantityMapper quantityMapper;
    
    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.ProductItemSearchRepositoryMockConfiguration
     */
    @Autowired
    private ProductItemSearchRepository mockProductItemSearchRepository;

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

    private MockMvc restProductItemMockMvc;

    private ProductItem productItem;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductItemResource productItemResource = new ProductItemResource(productItemMapper, priceMapper, quantityMapper, productItemRepository, mockProductItemSearchRepository);
        this.restProductItemMockMvc = MockMvcBuilders.standaloneSetup(productItemResource)
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
    public static ProductItem createEntity(EntityManager em) {
        ProductItem productItem = new ProductItem()
            .code(DEFAULT_CODE)
            .isDefault(DEFAULT_IS_DEFAULT)
            .quantity(DEFAULT_QUANTITY)
            .currency(DEFAULT_CURRENCY)
            .price(DEFAULT_PRICE);
        return productItem;
    }

    @Before
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
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(productItem.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
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
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductItem.class);
        ProductItem productItem1 = new ProductItem();
        productItem1.setId(1L);
        ProductItem productItem2 = new ProductItem();
        productItem2.setId(productItem1.getId());
        assertThat(productItem1).isEqualTo(productItem2);
        productItem2.setId(2L);
        assertThat(productItem1).isNotEqualTo(productItem2);
        productItem1.setId(null);
        assertThat(productItem1).isNotEqualTo(productItem2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductItemDTO.class);
        ProductItemDTO productItemDTO1 = new ProductItemDTO();
        productItemDTO1.setId(1L);
        ProductItemDTO productItemDTO2 = new ProductItemDTO();
        assertThat(productItemDTO1).isNotEqualTo(productItemDTO2);
        productItemDTO2.setId(productItemDTO1.getId());
        assertThat(productItemDTO1).isEqualTo(productItemDTO2);
        productItemDTO2.setId(2L);
        assertThat(productItemDTO1).isNotEqualTo(productItemDTO2);
        productItemDTO1.setId(null);
        assertThat(productItemDTO1).isNotEqualTo(productItemDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(productItemMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(productItemMapper.fromId(null)).isNull();
    }
}
