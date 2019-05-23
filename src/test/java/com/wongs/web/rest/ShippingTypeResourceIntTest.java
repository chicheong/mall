package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.ShippingType;
import com.wongs.repository.ShippingTypeRepository;
import com.wongs.repository.search.ShippingTypeSearchRepository;
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
 * Test class for the ShippingTypeResource REST controller.
 *
 * @see ShippingTypeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class ShippingTypeResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICE = new BigDecimal(2);

    private static final CurrencyType DEFAULT_CURRENCY = CurrencyType.HKD;
    private static final CurrencyType UPDATED_CURRENCY = CurrencyType.CNY;

    @Autowired
    private ShippingTypeRepository shippingTypeRepository;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.ShippingTypeSearchRepositoryMockConfiguration
     */
    @Autowired
    private ShippingTypeSearchRepository mockShippingTypeSearchRepository;

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

    private MockMvc restShippingTypeMockMvc;

    private ShippingType shippingType;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ShippingTypeResource shippingTypeResource = new ShippingTypeResource(shippingTypeRepository, mockShippingTypeSearchRepository);
        this.restShippingTypeMockMvc = MockMvcBuilders.standaloneSetup(shippingTypeResource)
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
    public static ShippingType createEntity(EntityManager em) {
        ShippingType shippingType = new ShippingType()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .price(DEFAULT_PRICE)
            .currency(DEFAULT_CURRENCY);
        return shippingType;
    }

    @Before
    public void initTest() {
        shippingType = createEntity(em);
    }

    @Test
    @Transactional
    public void createShippingType() throws Exception {
        int databaseSizeBeforeCreate = shippingTypeRepository.findAll().size();

        // Create the ShippingType
        restShippingTypeMockMvc.perform(post("/api/shipping-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shippingType)))
            .andExpect(status().isCreated());

        // Validate the ShippingType in the database
        List<ShippingType> shippingTypeList = shippingTypeRepository.findAll();
        assertThat(shippingTypeList).hasSize(databaseSizeBeforeCreate + 1);
        ShippingType testShippingType = shippingTypeList.get(shippingTypeList.size() - 1);
        assertThat(testShippingType.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testShippingType.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testShippingType.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testShippingType.getCurrency()).isEqualTo(DEFAULT_CURRENCY);

        // Validate the ShippingType in Elasticsearch
        verify(mockShippingTypeSearchRepository, times(1)).save(testShippingType);
    }

    @Test
    @Transactional
    public void createShippingTypeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = shippingTypeRepository.findAll().size();

        // Create the ShippingType with an existing ID
        shippingType.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restShippingTypeMockMvc.perform(post("/api/shipping-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shippingType)))
            .andExpect(status().isBadRequest());

        // Validate the ShippingType in the database
        List<ShippingType> shippingTypeList = shippingTypeRepository.findAll();
        assertThat(shippingTypeList).hasSize(databaseSizeBeforeCreate);

        // Validate the ShippingType in Elasticsearch
        verify(mockShippingTypeSearchRepository, times(0)).save(shippingType);
    }

    @Test
    @Transactional
    public void getAllShippingTypes() throws Exception {
        // Initialize the database
        shippingTypeRepository.saveAndFlush(shippingType);

        // Get all the shippingTypeList
        restShippingTypeMockMvc.perform(get("/api/shipping-types?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shippingType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())));
    }
    
    @Test
    @Transactional
    public void getShippingType() throws Exception {
        // Initialize the database
        shippingTypeRepository.saveAndFlush(shippingType);

        // Get the shippingType
        restShippingTypeMockMvc.perform(get("/api/shipping-types/{id}", shippingType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(shippingType.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.intValue()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingShippingType() throws Exception {
        // Get the shippingType
        restShippingTypeMockMvc.perform(get("/api/shipping-types/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateShippingType() throws Exception {
        // Initialize the database
        shippingTypeRepository.saveAndFlush(shippingType);

        int databaseSizeBeforeUpdate = shippingTypeRepository.findAll().size();

        // Update the shippingType
        ShippingType updatedShippingType = shippingTypeRepository.findById(shippingType.getId()).get();
        // Disconnect from session so that the updates on updatedShippingType are not directly saved in db
        em.detach(updatedShippingType);
        updatedShippingType
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .currency(UPDATED_CURRENCY);

        restShippingTypeMockMvc.perform(put("/api/shipping-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedShippingType)))
            .andExpect(status().isOk());

        // Validate the ShippingType in the database
        List<ShippingType> shippingTypeList = shippingTypeRepository.findAll();
        assertThat(shippingTypeList).hasSize(databaseSizeBeforeUpdate);
        ShippingType testShippingType = shippingTypeList.get(shippingTypeList.size() - 1);
        assertThat(testShippingType.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testShippingType.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testShippingType.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testShippingType.getCurrency()).isEqualTo(UPDATED_CURRENCY);

        // Validate the ShippingType in Elasticsearch
        verify(mockShippingTypeSearchRepository, times(1)).save(testShippingType);
    }

    @Test
    @Transactional
    public void updateNonExistingShippingType() throws Exception {
        int databaseSizeBeforeUpdate = shippingTypeRepository.findAll().size();

        // Create the ShippingType

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShippingTypeMockMvc.perform(put("/api/shipping-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shippingType)))
            .andExpect(status().isBadRequest());

        // Validate the ShippingType in the database
        List<ShippingType> shippingTypeList = shippingTypeRepository.findAll();
        assertThat(shippingTypeList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ShippingType in Elasticsearch
        verify(mockShippingTypeSearchRepository, times(0)).save(shippingType);
    }

    @Test
    @Transactional
    public void deleteShippingType() throws Exception {
        // Initialize the database
        shippingTypeRepository.saveAndFlush(shippingType);

        int databaseSizeBeforeDelete = shippingTypeRepository.findAll().size();

        // Delete the shippingType
        restShippingTypeMockMvc.perform(delete("/api/shipping-types/{id}", shippingType.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ShippingType> shippingTypeList = shippingTypeRepository.findAll();
        assertThat(shippingTypeList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ShippingType in Elasticsearch
        verify(mockShippingTypeSearchRepository, times(1)).deleteById(shippingType.getId());
    }

    @Test
    @Transactional
    public void searchShippingType() throws Exception {
        // Initialize the database
        shippingTypeRepository.saveAndFlush(shippingType);
        when(mockShippingTypeSearchRepository.search(queryStringQuery("id:" + shippingType.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(shippingType), PageRequest.of(0, 1), 1));
        // Search the shippingType
        restShippingTypeMockMvc.perform(get("/api/_search/shipping-types?query=id:" + shippingType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shippingType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShippingType.class);
        ShippingType shippingType1 = new ShippingType();
        shippingType1.setId(1L);
        ShippingType shippingType2 = new ShippingType();
        shippingType2.setId(shippingType1.getId());
        assertThat(shippingType1).isEqualTo(shippingType2);
        shippingType2.setId(2L);
        assertThat(shippingType1).isNotEqualTo(shippingType2);
        shippingType1.setId(null);
        assertThat(shippingType1).isNotEqualTo(shippingType2);
    }
}
