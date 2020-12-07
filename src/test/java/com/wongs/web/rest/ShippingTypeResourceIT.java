package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.ShippingType;
import com.wongs.repository.ShippingTypeRepository;
import com.wongs.repository.search.ShippingTypeSearchRepository;
import com.wongs.service.ShippingTypeService;
import com.wongs.service.dto.ShippingTypeDTO;
import com.wongs.service.mapper.ShippingTypeMapper;

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
 * Integration tests for the {@link ShippingTypeResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class ShippingTypeResourceIT {

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

    @Autowired
    private ShippingTypeMapper shippingTypeMapper;

    @Autowired
    private ShippingTypeService shippingTypeService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.ShippingTypeSearchRepositoryMockConfiguration
     */
    @Autowired
    private ShippingTypeSearchRepository mockShippingTypeSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShippingTypeMockMvc;

    private ShippingType shippingType;

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
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShippingType createUpdatedEntity(EntityManager em) {
        ShippingType shippingType = new ShippingType()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .currency(UPDATED_CURRENCY);
        return shippingType;
    }

    @BeforeEach
    public void initTest() {
        shippingType = createEntity(em);
    }

    @Test
    @Transactional
    public void createShippingType() throws Exception {
        int databaseSizeBeforeCreate = shippingTypeRepository.findAll().size();

        // Create the ShippingType
        ShippingTypeDTO shippingTypeDTO = shippingTypeMapper.toDto(shippingType);
        restShippingTypeMockMvc.perform(post("/api/shipping-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shippingTypeDTO)))
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
        ShippingTypeDTO shippingTypeDTO = shippingTypeMapper.toDto(shippingType);

        // An entity with an existing ID cannot be created, so this API call must fail
        restShippingTypeMockMvc.perform(post("/api/shipping-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shippingTypeDTO)))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shippingType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shippingType.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
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
        ShippingTypeDTO shippingTypeDTO = shippingTypeMapper.toDto(updatedShippingType);

        restShippingTypeMockMvc.perform(put("/api/shipping-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shippingTypeDTO)))
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
        ShippingTypeDTO shippingTypeDTO = shippingTypeMapper.toDto(shippingType);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShippingTypeMockMvc.perform(put("/api/shipping-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shippingTypeDTO)))
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
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shippingType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())));
    }
}
