package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.ShippingPriceRule;
import com.wongs.repository.ShippingPriceRuleRepository;
import com.wongs.repository.search.ShippingPriceRuleSearchRepository;
import com.wongs.service.ShippingPriceRuleService;
import com.wongs.service.dto.ShippingPriceRuleDTO;
import com.wongs.service.mapper.ShippingPriceRuleMapper;

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

import com.wongs.domain.enumeration.ShippingPriceRuleType;
/**
 * Integration tests for the {@link ShippingPriceRuleResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class ShippingPriceRuleResourceIT {

    private static final ShippingPriceRuleType DEFAULT_TYPE = ShippingPriceRuleType.FIXED_PER_ORDER;
    private static final ShippingPriceRuleType UPDATED_TYPE = ShippingPriceRuleType.TOTAL_PERCENTAGE;

    private static final BigDecimal DEFAULT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALUE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICE = new BigDecimal(2);

    private static final Integer DEFAULT_SEQUENCE = 1;
    private static final Integer UPDATED_SEQUENCE = 2;

    @Autowired
    private ShippingPriceRuleRepository shippingPriceRuleRepository;

    @Autowired
    private ShippingPriceRuleMapper shippingPriceRuleMapper;

    @Autowired
    private ShippingPriceRuleService shippingPriceRuleService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.ShippingPriceRuleSearchRepositoryMockConfiguration
     */
    @Autowired
    private ShippingPriceRuleSearchRepository mockShippingPriceRuleSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShippingPriceRuleMockMvc;

    private ShippingPriceRule shippingPriceRule;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShippingPriceRule createEntity(EntityManager em) {
        ShippingPriceRule shippingPriceRule = new ShippingPriceRule()
            .type(DEFAULT_TYPE)
            .value(DEFAULT_VALUE)
            .price(DEFAULT_PRICE)
            .sequence(DEFAULT_SEQUENCE);
        return shippingPriceRule;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShippingPriceRule createUpdatedEntity(EntityManager em) {
        ShippingPriceRule shippingPriceRule = new ShippingPriceRule()
            .type(UPDATED_TYPE)
            .value(UPDATED_VALUE)
            .price(UPDATED_PRICE)
            .sequence(UPDATED_SEQUENCE);
        return shippingPriceRule;
    }

    @BeforeEach
    public void initTest() {
        shippingPriceRule = createEntity(em);
    }

    @Test
    @Transactional
    public void createShippingPriceRule() throws Exception {
        int databaseSizeBeforeCreate = shippingPriceRuleRepository.findAll().size();

        // Create the ShippingPriceRule
        ShippingPriceRuleDTO shippingPriceRuleDTO = shippingPriceRuleMapper.toDto(shippingPriceRule);
        restShippingPriceRuleMockMvc.perform(post("/api/shipping-price-rules")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shippingPriceRuleDTO)))
            .andExpect(status().isCreated());

        // Validate the ShippingPriceRule in the database
        List<ShippingPriceRule> shippingPriceRuleList = shippingPriceRuleRepository.findAll();
        assertThat(shippingPriceRuleList).hasSize(databaseSizeBeforeCreate + 1);
        ShippingPriceRule testShippingPriceRule = shippingPriceRuleList.get(shippingPriceRuleList.size() - 1);
        assertThat(testShippingPriceRule.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testShippingPriceRule.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testShippingPriceRule.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testShippingPriceRule.getSequence()).isEqualTo(DEFAULT_SEQUENCE);

        // Validate the ShippingPriceRule in Elasticsearch
        verify(mockShippingPriceRuleSearchRepository, times(1)).save(testShippingPriceRule);
    }

    @Test
    @Transactional
    public void createShippingPriceRuleWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = shippingPriceRuleRepository.findAll().size();

        // Create the ShippingPriceRule with an existing ID
        shippingPriceRule.setId(1L);
        ShippingPriceRuleDTO shippingPriceRuleDTO = shippingPriceRuleMapper.toDto(shippingPriceRule);

        // An entity with an existing ID cannot be created, so this API call must fail
        restShippingPriceRuleMockMvc.perform(post("/api/shipping-price-rules")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shippingPriceRuleDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ShippingPriceRule in the database
        List<ShippingPriceRule> shippingPriceRuleList = shippingPriceRuleRepository.findAll();
        assertThat(shippingPriceRuleList).hasSize(databaseSizeBeforeCreate);

        // Validate the ShippingPriceRule in Elasticsearch
        verify(mockShippingPriceRuleSearchRepository, times(0)).save(shippingPriceRule);
    }


    @Test
    @Transactional
    public void getAllShippingPriceRules() throws Exception {
        // Initialize the database
        shippingPriceRuleRepository.saveAndFlush(shippingPriceRule);

        // Get all the shippingPriceRuleList
        restShippingPriceRuleMockMvc.perform(get("/api/shipping-price-rules?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shippingPriceRule.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].sequence").value(hasItem(DEFAULT_SEQUENCE)));
    }
    
    @Test
    @Transactional
    public void getShippingPriceRule() throws Exception {
        // Initialize the database
        shippingPriceRuleRepository.saveAndFlush(shippingPriceRule);

        // Get the shippingPriceRule
        restShippingPriceRuleMockMvc.perform(get("/api/shipping-price-rules/{id}", shippingPriceRule.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shippingPriceRule.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.intValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.intValue()))
            .andExpect(jsonPath("$.sequence").value(DEFAULT_SEQUENCE));
    }

    @Test
    @Transactional
    public void getNonExistingShippingPriceRule() throws Exception {
        // Get the shippingPriceRule
        restShippingPriceRuleMockMvc.perform(get("/api/shipping-price-rules/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateShippingPriceRule() throws Exception {
        // Initialize the database
        shippingPriceRuleRepository.saveAndFlush(shippingPriceRule);

        int databaseSizeBeforeUpdate = shippingPriceRuleRepository.findAll().size();

        // Update the shippingPriceRule
        ShippingPriceRule updatedShippingPriceRule = shippingPriceRuleRepository.findById(shippingPriceRule.getId()).get();
        // Disconnect from session so that the updates on updatedShippingPriceRule are not directly saved in db
        em.detach(updatedShippingPriceRule);
        updatedShippingPriceRule
            .type(UPDATED_TYPE)
            .value(UPDATED_VALUE)
            .price(UPDATED_PRICE)
            .sequence(UPDATED_SEQUENCE);
        ShippingPriceRuleDTO shippingPriceRuleDTO = shippingPriceRuleMapper.toDto(updatedShippingPriceRule);

        restShippingPriceRuleMockMvc.perform(put("/api/shipping-price-rules")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shippingPriceRuleDTO)))
            .andExpect(status().isOk());

        // Validate the ShippingPriceRule in the database
        List<ShippingPriceRule> shippingPriceRuleList = shippingPriceRuleRepository.findAll();
        assertThat(shippingPriceRuleList).hasSize(databaseSizeBeforeUpdate);
        ShippingPriceRule testShippingPriceRule = shippingPriceRuleList.get(shippingPriceRuleList.size() - 1);
        assertThat(testShippingPriceRule.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testShippingPriceRule.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testShippingPriceRule.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testShippingPriceRule.getSequence()).isEqualTo(UPDATED_SEQUENCE);

        // Validate the ShippingPriceRule in Elasticsearch
        verify(mockShippingPriceRuleSearchRepository, times(1)).save(testShippingPriceRule);
    }

    @Test
    @Transactional
    public void updateNonExistingShippingPriceRule() throws Exception {
        int databaseSizeBeforeUpdate = shippingPriceRuleRepository.findAll().size();

        // Create the ShippingPriceRule
        ShippingPriceRuleDTO shippingPriceRuleDTO = shippingPriceRuleMapper.toDto(shippingPriceRule);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShippingPriceRuleMockMvc.perform(put("/api/shipping-price-rules")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shippingPriceRuleDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ShippingPriceRule in the database
        List<ShippingPriceRule> shippingPriceRuleList = shippingPriceRuleRepository.findAll();
        assertThat(shippingPriceRuleList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ShippingPriceRule in Elasticsearch
        verify(mockShippingPriceRuleSearchRepository, times(0)).save(shippingPriceRule);
    }

    @Test
    @Transactional
    public void deleteShippingPriceRule() throws Exception {
        // Initialize the database
        shippingPriceRuleRepository.saveAndFlush(shippingPriceRule);

        int databaseSizeBeforeDelete = shippingPriceRuleRepository.findAll().size();

        // Delete the shippingPriceRule
        restShippingPriceRuleMockMvc.perform(delete("/api/shipping-price-rules/{id}", shippingPriceRule.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ShippingPriceRule> shippingPriceRuleList = shippingPriceRuleRepository.findAll();
        assertThat(shippingPriceRuleList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ShippingPriceRule in Elasticsearch
        verify(mockShippingPriceRuleSearchRepository, times(1)).deleteById(shippingPriceRule.getId());
    }

    @Test
    @Transactional
    public void searchShippingPriceRule() throws Exception {
        // Initialize the database
        shippingPriceRuleRepository.saveAndFlush(shippingPriceRule);
        when(mockShippingPriceRuleSearchRepository.search(queryStringQuery("id:" + shippingPriceRule.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(shippingPriceRule), PageRequest.of(0, 1), 1));
        // Search the shippingPriceRule
        restShippingPriceRuleMockMvc.perform(get("/api/_search/shipping-price-rules?query=id:" + shippingPriceRule.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shippingPriceRule.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].sequence").value(hasItem(DEFAULT_SEQUENCE)));
    }
}
