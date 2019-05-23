package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.Office;
import com.wongs.repository.OfficeRepository;
import com.wongs.repository.search.OfficeSearchRepository;
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
import java.util.Collections;
import java.util.List;


import static com.wongs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wongs.domain.enumeration.CommonStatus;
/**
 * Test class for the OfficeResource REST controller.
 *
 * @see OfficeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class OfficeResourceIntTest {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final CommonStatus DEFAULT_STATUS = CommonStatus.ACTIVE;
    private static final CommonStatus UPDATED_STATUS = CommonStatus.INACTIVE;

    @Autowired
    private OfficeRepository officeRepository;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.OfficeSearchRepositoryMockConfiguration
     */
    @Autowired
    private OfficeSearchRepository mockOfficeSearchRepository;

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

    private MockMvc restOfficeMockMvc;

    private Office office;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OfficeResource officeResource = new OfficeResource(officeRepository, mockOfficeSearchRepository);
        this.restOfficeMockMvc = MockMvcBuilders.standaloneSetup(officeResource)
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
    public static Office createEntity(EntityManager em) {
        Office office = new Office()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .status(DEFAULT_STATUS);
        return office;
    }

    @Before
    public void initTest() {
        office = createEntity(em);
    }

    @Test
    @Transactional
    public void createOffice() throws Exception {
        int databaseSizeBeforeCreate = officeRepository.findAll().size();

        // Create the Office
        restOfficeMockMvc.perform(post("/api/offices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(office)))
            .andExpect(status().isCreated());

        // Validate the Office in the database
        List<Office> officeList = officeRepository.findAll();
        assertThat(officeList).hasSize(databaseSizeBeforeCreate + 1);
        Office testOffice = officeList.get(officeList.size() - 1);
        assertThat(testOffice.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testOffice.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testOffice.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the Office in Elasticsearch
        verify(mockOfficeSearchRepository, times(1)).save(testOffice);
    }

    @Test
    @Transactional
    public void createOfficeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = officeRepository.findAll().size();

        // Create the Office with an existing ID
        office.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOfficeMockMvc.perform(post("/api/offices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(office)))
            .andExpect(status().isBadRequest());

        // Validate the Office in the database
        List<Office> officeList = officeRepository.findAll();
        assertThat(officeList).hasSize(databaseSizeBeforeCreate);

        // Validate the Office in Elasticsearch
        verify(mockOfficeSearchRepository, times(0)).save(office);
    }

    @Test
    @Transactional
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = officeRepository.findAll().size();
        // set the field null
        office.setCode(null);

        // Create the Office, which fails.

        restOfficeMockMvc.perform(post("/api/offices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(office)))
            .andExpect(status().isBadRequest());

        List<Office> officeList = officeRepository.findAll();
        assertThat(officeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllOffices() throws Exception {
        // Initialize the database
        officeRepository.saveAndFlush(office);

        // Get all the officeList
        restOfficeMockMvc.perform(get("/api/offices?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(office.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
    
    @Test
    @Transactional
    public void getOffice() throws Exception {
        // Initialize the database
        officeRepository.saveAndFlush(office);

        // Get the office
        restOfficeMockMvc.perform(get("/api/offices/{id}", office.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(office.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingOffice() throws Exception {
        // Get the office
        restOfficeMockMvc.perform(get("/api/offices/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOffice() throws Exception {
        // Initialize the database
        officeRepository.saveAndFlush(office);

        int databaseSizeBeforeUpdate = officeRepository.findAll().size();

        // Update the office
        Office updatedOffice = officeRepository.findById(office.getId()).get();
        // Disconnect from session so that the updates on updatedOffice are not directly saved in db
        em.detach(updatedOffice);
        updatedOffice
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS);

        restOfficeMockMvc.perform(put("/api/offices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOffice)))
            .andExpect(status().isOk());

        // Validate the Office in the database
        List<Office> officeList = officeRepository.findAll();
        assertThat(officeList).hasSize(databaseSizeBeforeUpdate);
        Office testOffice = officeList.get(officeList.size() - 1);
        assertThat(testOffice.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testOffice.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testOffice.getStatus()).isEqualTo(UPDATED_STATUS);

        // Validate the Office in Elasticsearch
        verify(mockOfficeSearchRepository, times(1)).save(testOffice);
    }

    @Test
    @Transactional
    public void updateNonExistingOffice() throws Exception {
        int databaseSizeBeforeUpdate = officeRepository.findAll().size();

        // Create the Office

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOfficeMockMvc.perform(put("/api/offices")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(office)))
            .andExpect(status().isBadRequest());

        // Validate the Office in the database
        List<Office> officeList = officeRepository.findAll();
        assertThat(officeList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Office in Elasticsearch
        verify(mockOfficeSearchRepository, times(0)).save(office);
    }

    @Test
    @Transactional
    public void deleteOffice() throws Exception {
        // Initialize the database
        officeRepository.saveAndFlush(office);

        int databaseSizeBeforeDelete = officeRepository.findAll().size();

        // Delete the office
        restOfficeMockMvc.perform(delete("/api/offices/{id}", office.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Office> officeList = officeRepository.findAll();
        assertThat(officeList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Office in Elasticsearch
        verify(mockOfficeSearchRepository, times(1)).deleteById(office.getId());
    }

    @Test
    @Transactional
    public void searchOffice() throws Exception {
        // Initialize the database
        officeRepository.saveAndFlush(office);
        when(mockOfficeSearchRepository.search(queryStringQuery("id:" + office.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(office), PageRequest.of(0, 1), 1));
        // Search the office
        restOfficeMockMvc.perform(get("/api/_search/offices?query=id:" + office.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(office.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Office.class);
        Office office1 = new Office();
        office1.setId(1L);
        Office office2 = new Office();
        office2.setId(office1.getId());
        assertThat(office1).isEqualTo(office2);
        office2.setId(2L);
        assertThat(office1).isNotEqualTo(office2);
        office1.setId(null);
        assertThat(office1).isNotEqualTo(office2);
    }
}
