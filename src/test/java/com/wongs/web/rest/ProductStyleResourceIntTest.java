package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.ProductStyle;
import com.wongs.repository.ProductStyleRepository;
import com.wongs.repository.search.ProductStyleSearchRepository;
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
import java.util.List;

import static com.wongs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wongs.domain.enumeration.ProductStyleType;
/**
 * Test class for the ProductStyleResource REST controller.
 *
 * @see ProductStyleResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class ProductStyleResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_DEFAULT = false;
    private static final Boolean UPDATED_IS_DEFAULT = true;

    private static final ProductStyleType DEFAULT_TYPE = ProductStyleType.COLOR;
    private static final ProductStyleType UPDATED_TYPE = ProductStyleType.SIZE;

    @Autowired
    private ProductStyleRepository productStyleRepository;

    @Autowired
    private ProductStyleSearchRepository productStyleSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restProductStyleMockMvc;

    private ProductStyle productStyle;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductStyleResource productStyleResource = new ProductStyleResource(productStyleRepository, productStyleSearchRepository);
        this.restProductStyleMockMvc = MockMvcBuilders.standaloneSetup(productStyleResource)
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
    public static ProductStyle createEntity(EntityManager em) {
        ProductStyle productStyle = new ProductStyle()
            .name(DEFAULT_NAME)
            .code(DEFAULT_CODE)
            .isDefault(DEFAULT_IS_DEFAULT)
            .type(DEFAULT_TYPE);
        return productStyle;
    }

    @Before
    public void initTest() {
        productStyleSearchRepository.deleteAll();
        productStyle = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductStyle() throws Exception {
        int databaseSizeBeforeCreate = productStyleRepository.findAll().size();

        // Create the ProductStyle
        restProductStyleMockMvc.perform(post("/api/product-styles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productStyle)))
            .andExpect(status().isCreated());

        // Validate the ProductStyle in the database
        List<ProductStyle> productStyleList = productStyleRepository.findAll();
        assertThat(productStyleList).hasSize(databaseSizeBeforeCreate + 1);
        ProductStyle testProductStyle = productStyleList.get(productStyleList.size() - 1);
        assertThat(testProductStyle.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProductStyle.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testProductStyle.isIsDefault()).isEqualTo(DEFAULT_IS_DEFAULT);
        assertThat(testProductStyle.getType()).isEqualTo(DEFAULT_TYPE);

        // Validate the ProductStyle in Elasticsearch
        ProductStyle productStyleEs = productStyleSearchRepository.findOne(testProductStyle.getId());
        assertThat(productStyleEs).isEqualToIgnoringGivenFields(testProductStyle);
    }

    @Test
    @Transactional
    public void createProductStyleWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productStyleRepository.findAll().size();

        // Create the ProductStyle with an existing ID
        productStyle.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductStyleMockMvc.perform(post("/api/product-styles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productStyle)))
            .andExpect(status().isBadRequest());

        // Validate the ProductStyle in the database
        List<ProductStyle> productStyleList = productStyleRepository.findAll();
        assertThat(productStyleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllProductStyles() throws Exception {
        // Initialize the database
        productStyleRepository.saveAndFlush(productStyle);

        // Get all the productStyleList
        restProductStyleMockMvc.perform(get("/api/product-styles?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productStyle.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    public void getProductStyle() throws Exception {
        // Initialize the database
        productStyleRepository.saveAndFlush(productStyle);

        // Get the productStyle
        restProductStyleMockMvc.perform(get("/api/product-styles/{id}", productStyle.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(productStyle.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.isDefault").value(DEFAULT_IS_DEFAULT.booleanValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingProductStyle() throws Exception {
        // Get the productStyle
        restProductStyleMockMvc.perform(get("/api/product-styles/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProductStyle() throws Exception {
        // Initialize the database
        productStyleRepository.saveAndFlush(productStyle);
        productStyleSearchRepository.save(productStyle);
        int databaseSizeBeforeUpdate = productStyleRepository.findAll().size();

        // Update the productStyle
        ProductStyle updatedProductStyle = productStyleRepository.findOne(productStyle.getId());
        // Disconnect from session so that the updates on updatedProductStyle are not directly saved in db
        em.detach(updatedProductStyle);
        updatedProductStyle
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .isDefault(UPDATED_IS_DEFAULT)
            .type(UPDATED_TYPE);

        restProductStyleMockMvc.perform(put("/api/product-styles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProductStyle)))
            .andExpect(status().isOk());

        // Validate the ProductStyle in the database
        List<ProductStyle> productStyleList = productStyleRepository.findAll();
        assertThat(productStyleList).hasSize(databaseSizeBeforeUpdate);
        ProductStyle testProductStyle = productStyleList.get(productStyleList.size() - 1);
        assertThat(testProductStyle.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProductStyle.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testProductStyle.isIsDefault()).isEqualTo(UPDATED_IS_DEFAULT);
        assertThat(testProductStyle.getType()).isEqualTo(UPDATED_TYPE);

        // Validate the ProductStyle in Elasticsearch
        ProductStyle productStyleEs = productStyleSearchRepository.findOne(testProductStyle.getId());
        assertThat(productStyleEs).isEqualToIgnoringGivenFields(testProductStyle);
    }

    @Test
    @Transactional
    public void updateNonExistingProductStyle() throws Exception {
        int databaseSizeBeforeUpdate = productStyleRepository.findAll().size();

        // Create the ProductStyle

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restProductStyleMockMvc.perform(put("/api/product-styles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productStyle)))
            .andExpect(status().isCreated());

        // Validate the ProductStyle in the database
        List<ProductStyle> productStyleList = productStyleRepository.findAll();
        assertThat(productStyleList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteProductStyle() throws Exception {
        // Initialize the database
        productStyleRepository.saveAndFlush(productStyle);
        productStyleSearchRepository.save(productStyle);
        int databaseSizeBeforeDelete = productStyleRepository.findAll().size();

        // Get the productStyle
        restProductStyleMockMvc.perform(delete("/api/product-styles/{id}", productStyle.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean productStyleExistsInEs = productStyleSearchRepository.exists(productStyle.getId());
        assertThat(productStyleExistsInEs).isFalse();

        // Validate the database is empty
        List<ProductStyle> productStyleList = productStyleRepository.findAll();
        assertThat(productStyleList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchProductStyle() throws Exception {
        // Initialize the database
        productStyleRepository.saveAndFlush(productStyle);
        productStyleSearchRepository.save(productStyle);

        // Search the productStyle
        restProductStyleMockMvc.perform(get("/api/_search/product-styles?query=id:" + productStyle.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productStyle.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].isDefault").value(hasItem(DEFAULT_IS_DEFAULT.booleanValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductStyle.class);
        ProductStyle productStyle1 = new ProductStyle();
        productStyle1.setId(1L);
        ProductStyle productStyle2 = new ProductStyle();
        productStyle2.setId(productStyle1.getId());
        assertThat(productStyle1).isEqualTo(productStyle2);
        productStyle2.setId(2L);
        assertThat(productStyle1).isNotEqualTo(productStyle2);
        productStyle1.setId(null);
        assertThat(productStyle1).isNotEqualTo(productStyle2);
    }
}
