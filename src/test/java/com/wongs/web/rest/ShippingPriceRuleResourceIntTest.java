package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.ShippingPriceRule;
import com.wongs.repository.ShippingPriceRuleRepository;
import com.wongs.repository.search.ShippingPriceRuleSearchRepository;
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
import java.util.List;

import static com.wongs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ShippingPriceRuleResource REST controller.
 *
 * @see ShippingPriceRuleResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class ShippingPriceRuleResourceIntTest {

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALUE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICE = new BigDecimal(2);

    @Autowired
    private ShippingPriceRuleRepository shippingPriceRuleRepository;

    @Autowired
    private ShippingPriceRuleSearchRepository shippingPriceRuleSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restShippingPriceRuleMockMvc;

    private ShippingPriceRule shippingPriceRule;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ShippingPriceRuleResource shippingPriceRuleResource = new ShippingPriceRuleResource(shippingPriceRuleRepository, shippingPriceRuleSearchRepository);
        this.restShippingPriceRuleMockMvc = MockMvcBuilders.standaloneSetup(shippingPriceRuleResource)
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
    public static ShippingPriceRule createEntity(EntityManager em) {
        ShippingPriceRule shippingPriceRule = new ShippingPriceRule()
            .type(DEFAULT_TYPE)
            .value(DEFAULT_VALUE)
            .price(DEFAULT_PRICE);
        return shippingPriceRule;
    }

    @Before
    public void initTest() {
        shippingPriceRuleSearchRepository.deleteAll();
        shippingPriceRule = createEntity(em);
    }

    @Test
    @Transactional
    public void createShippingPriceRule() throws Exception {
        int databaseSizeBeforeCreate = shippingPriceRuleRepository.findAll().size();

        // Create the ShippingPriceRule
        restShippingPriceRuleMockMvc.perform(post("/api/shipping-price-rules")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shippingPriceRule)))
            .andExpect(status().isCreated());

        // Validate the ShippingPriceRule in the database
        List<ShippingPriceRule> shippingPriceRuleList = shippingPriceRuleRepository.findAll();
        assertThat(shippingPriceRuleList).hasSize(databaseSizeBeforeCreate + 1);
        ShippingPriceRule testShippingPriceRule = shippingPriceRuleList.get(shippingPriceRuleList.size() - 1);
        assertThat(testShippingPriceRule.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testShippingPriceRule.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testShippingPriceRule.getPrice()).isEqualTo(DEFAULT_PRICE);

        // Validate the ShippingPriceRule in Elasticsearch
        ShippingPriceRule shippingPriceRuleEs = shippingPriceRuleSearchRepository.findOne(testShippingPriceRule.getId());
        assertThat(shippingPriceRuleEs).isEqualToIgnoringGivenFields(testShippingPriceRule);
    }

    @Test
    @Transactional
    public void createShippingPriceRuleWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = shippingPriceRuleRepository.findAll().size();

        // Create the ShippingPriceRule with an existing ID
        shippingPriceRule.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restShippingPriceRuleMockMvc.perform(post("/api/shipping-price-rules")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shippingPriceRule)))
            .andExpect(status().isBadRequest());

        // Validate the ShippingPriceRule in the database
        List<ShippingPriceRule> shippingPriceRuleList = shippingPriceRuleRepository.findAll();
        assertThat(shippingPriceRuleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllShippingPriceRules() throws Exception {
        // Initialize the database
        shippingPriceRuleRepository.saveAndFlush(shippingPriceRule);

        // Get all the shippingPriceRuleList
        restShippingPriceRuleMockMvc.perform(get("/api/shipping-price-rules?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shippingPriceRule.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())));
    }

    @Test
    @Transactional
    public void getShippingPriceRule() throws Exception {
        // Initialize the database
        shippingPriceRuleRepository.saveAndFlush(shippingPriceRule);

        // Get the shippingPriceRule
        restShippingPriceRuleMockMvc.perform(get("/api/shipping-price-rules/{id}", shippingPriceRule.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(shippingPriceRule.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.intValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.intValue()));
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
        shippingPriceRuleSearchRepository.save(shippingPriceRule);
        int databaseSizeBeforeUpdate = shippingPriceRuleRepository.findAll().size();

        // Update the shippingPriceRule
        ShippingPriceRule updatedShippingPriceRule = shippingPriceRuleRepository.findOne(shippingPriceRule.getId());
        // Disconnect from session so that the updates on updatedShippingPriceRule are not directly saved in db
        em.detach(updatedShippingPriceRule);
        updatedShippingPriceRule
            .type(UPDATED_TYPE)
            .value(UPDATED_VALUE)
            .price(UPDATED_PRICE);

        restShippingPriceRuleMockMvc.perform(put("/api/shipping-price-rules")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedShippingPriceRule)))
            .andExpect(status().isOk());

        // Validate the ShippingPriceRule in the database
        List<ShippingPriceRule> shippingPriceRuleList = shippingPriceRuleRepository.findAll();
        assertThat(shippingPriceRuleList).hasSize(databaseSizeBeforeUpdate);
        ShippingPriceRule testShippingPriceRule = shippingPriceRuleList.get(shippingPriceRuleList.size() - 1);
        assertThat(testShippingPriceRule.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testShippingPriceRule.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testShippingPriceRule.getPrice()).isEqualTo(UPDATED_PRICE);

        // Validate the ShippingPriceRule in Elasticsearch
        ShippingPriceRule shippingPriceRuleEs = shippingPriceRuleSearchRepository.findOne(testShippingPriceRule.getId());
        assertThat(shippingPriceRuleEs).isEqualToIgnoringGivenFields(testShippingPriceRule);
    }

    @Test
    @Transactional
    public void updateNonExistingShippingPriceRule() throws Exception {
        int databaseSizeBeforeUpdate = shippingPriceRuleRepository.findAll().size();

        // Create the ShippingPriceRule

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restShippingPriceRuleMockMvc.perform(put("/api/shipping-price-rules")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shippingPriceRule)))
            .andExpect(status().isCreated());

        // Validate the ShippingPriceRule in the database
        List<ShippingPriceRule> shippingPriceRuleList = shippingPriceRuleRepository.findAll();
        assertThat(shippingPriceRuleList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteShippingPriceRule() throws Exception {
        // Initialize the database
        shippingPriceRuleRepository.saveAndFlush(shippingPriceRule);
        shippingPriceRuleSearchRepository.save(shippingPriceRule);
        int databaseSizeBeforeDelete = shippingPriceRuleRepository.findAll().size();

        // Get the shippingPriceRule
        restShippingPriceRuleMockMvc.perform(delete("/api/shipping-price-rules/{id}", shippingPriceRule.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean shippingPriceRuleExistsInEs = shippingPriceRuleSearchRepository.exists(shippingPriceRule.getId());
        assertThat(shippingPriceRuleExistsInEs).isFalse();

        // Validate the database is empty
        List<ShippingPriceRule> shippingPriceRuleList = shippingPriceRuleRepository.findAll();
        assertThat(shippingPriceRuleList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchShippingPriceRule() throws Exception {
        // Initialize the database
        shippingPriceRuleRepository.saveAndFlush(shippingPriceRule);
        shippingPriceRuleSearchRepository.save(shippingPriceRule);

        // Search the shippingPriceRule
        restShippingPriceRuleMockMvc.perform(get("/api/_search/shipping-price-rules?query=id:" + shippingPriceRule.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shippingPriceRule.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShippingPriceRule.class);
        ShippingPriceRule shippingPriceRule1 = new ShippingPriceRule();
        shippingPriceRule1.setId(1L);
        ShippingPriceRule shippingPriceRule2 = new ShippingPriceRule();
        shippingPriceRule2.setId(shippingPriceRule1.getId());
        assertThat(shippingPriceRule1).isEqualTo(shippingPriceRule2);
        shippingPriceRule2.setId(2L);
        assertThat(shippingPriceRule1).isNotEqualTo(shippingPriceRule2);
        shippingPriceRule1.setId(null);
        assertThat(shippingPriceRule1).isNotEqualTo(shippingPriceRule2);
    }
}
