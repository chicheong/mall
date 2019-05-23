package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.Delegation;
import com.wongs.repository.DelegationRepository;
import com.wongs.repository.search.DelegationSearchRepository;
import com.wongs.service.DelegationService;
import com.wongs.service.dto.DelegationDTO;
import com.wongs.service.mapper.DelegationMapper;
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
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;


import static com.wongs.web.rest.TestUtil.sameInstant;
import static com.wongs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wongs.domain.enumeration.DelegationType;
import com.wongs.domain.enumeration.CommonStatus;
/**
 * Test class for the DelegationResource REST controller.
 *
 * @see DelegationResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class DelegationResourceIntTest {

    private static final ZonedDateTime DEFAULT_FROM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_FROM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_TO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final DelegationType DEFAULT_TYPE = DelegationType.ACCOUNT;
    private static final DelegationType UPDATED_TYPE = DelegationType.COMPANY;

    private static final String DEFAULT_DELEGATE_ID = "AAAAAAAAAA";
    private static final String UPDATED_DELEGATE_ID = "BBBBBBBBBB";

    private static final CommonStatus DEFAULT_STATUS = CommonStatus.ACTIVE;
    private static final CommonStatus UPDATED_STATUS = CommonStatus.INACTIVE;

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_LAST_MODIFIED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST_MODIFIED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private DelegationRepository delegationRepository;

    @Autowired
    private DelegationMapper delegationMapper;

    @Autowired
    private DelegationService delegationService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.DelegationSearchRepositoryMockConfiguration
     */
    @Autowired
    private DelegationSearchRepository mockDelegationSearchRepository;

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

    private MockMvc restDelegationMockMvc;

    private Delegation delegation;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DelegationResource delegationResource = new DelegationResource(delegationService);
        this.restDelegationMockMvc = MockMvcBuilders.standaloneSetup(delegationResource)
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
    public static Delegation createEntity(EntityManager em) {
        Delegation delegation = new Delegation()
            .from(DEFAULT_FROM)
            .to(DEFAULT_TO)
            .type(DEFAULT_TYPE)
            .delegateId(DEFAULT_DELEGATE_ID)
            .status(DEFAULT_STATUS)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY)
            .lastModifiedDate(DEFAULT_LAST_MODIFIED_DATE);
        return delegation;
    }

    @Before
    public void initTest() {
        delegation = createEntity(em);
    }

    @Test
    @Transactional
    public void createDelegation() throws Exception {
        int databaseSizeBeforeCreate = delegationRepository.findAll().size();

        // Create the Delegation
        DelegationDTO delegationDTO = delegationMapper.toDto(delegation);
        restDelegationMockMvc.perform(post("/api/delegations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(delegationDTO)))
            .andExpect(status().isCreated());

        // Validate the Delegation in the database
        List<Delegation> delegationList = delegationRepository.findAll();
        assertThat(delegationList).hasSize(databaseSizeBeforeCreate + 1);
        Delegation testDelegation = delegationList.get(delegationList.size() - 1);
        assertThat(testDelegation.getFrom()).isEqualTo(DEFAULT_FROM);
        assertThat(testDelegation.getTo()).isEqualTo(DEFAULT_TO);
        assertThat(testDelegation.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testDelegation.getDelegateId()).isEqualTo(DEFAULT_DELEGATE_ID);
        assertThat(testDelegation.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testDelegation.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
        assertThat(testDelegation.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testDelegation.getLastModifiedBy()).isEqualTo(DEFAULT_LAST_MODIFIED_BY);
        assertThat(testDelegation.getLastModifiedDate()).isEqualTo(DEFAULT_LAST_MODIFIED_DATE);

        // Validate the Delegation in Elasticsearch
        verify(mockDelegationSearchRepository, times(1)).save(testDelegation);
    }

    @Test
    @Transactional
    public void createDelegationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = delegationRepository.findAll().size();

        // Create the Delegation with an existing ID
        delegation.setId(1L);
        DelegationDTO delegationDTO = delegationMapper.toDto(delegation);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDelegationMockMvc.perform(post("/api/delegations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(delegationDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Delegation in the database
        List<Delegation> delegationList = delegationRepository.findAll();
        assertThat(delegationList).hasSize(databaseSizeBeforeCreate);

        // Validate the Delegation in Elasticsearch
        verify(mockDelegationSearchRepository, times(0)).save(delegation);
    }

    @Test
    @Transactional
    public void getAllDelegations() throws Exception {
        // Initialize the database
        delegationRepository.saveAndFlush(delegation);

        // Get all the delegationList
        restDelegationMockMvc.perform(get("/api/delegations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(delegation.getId().intValue())))
            .andExpect(jsonPath("$.[*].from").value(hasItem(sameInstant(DEFAULT_FROM))))
            .andExpect(jsonPath("$.[*].to").value(hasItem(sameInstant(DEFAULT_TO))))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].delegateId").value(hasItem(DEFAULT_DELEGATE_ID.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(sameInstant(DEFAULT_LAST_MODIFIED_DATE))));
    }
    
    @Test
    @Transactional
    public void getDelegation() throws Exception {
        // Initialize the database
        delegationRepository.saveAndFlush(delegation);

        // Get the delegation
        restDelegationMockMvc.perform(get("/api/delegations/{id}", delegation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(delegation.getId().intValue()))
            .andExpect(jsonPath("$.from").value(sameInstant(DEFAULT_FROM)))
            .andExpect(jsonPath("$.to").value(sameInstant(DEFAULT_TO)))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.delegateId").value(DEFAULT_DELEGATE_ID.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY.toString()))
            .andExpect(jsonPath("$.createdDate").value(sameInstant(DEFAULT_CREATED_DATE)))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY.toString()))
            .andExpect(jsonPath("$.lastModifiedDate").value(sameInstant(DEFAULT_LAST_MODIFIED_DATE)));
    }

    @Test
    @Transactional
    public void getNonExistingDelegation() throws Exception {
        // Get the delegation
        restDelegationMockMvc.perform(get("/api/delegations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDelegation() throws Exception {
        // Initialize the database
        delegationRepository.saveAndFlush(delegation);

        int databaseSizeBeforeUpdate = delegationRepository.findAll().size();

        // Update the delegation
        Delegation updatedDelegation = delegationRepository.findById(delegation.getId()).get();
        // Disconnect from session so that the updates on updatedDelegation are not directly saved in db
        em.detach(updatedDelegation);
        updatedDelegation
            .from(UPDATED_FROM)
            .to(UPDATED_TO)
            .type(UPDATED_TYPE)
            .delegateId(UPDATED_DELEGATE_ID)
            .status(UPDATED_STATUS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        DelegationDTO delegationDTO = delegationMapper.toDto(updatedDelegation);

        restDelegationMockMvc.perform(put("/api/delegations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(delegationDTO)))
            .andExpect(status().isOk());

        // Validate the Delegation in the database
        List<Delegation> delegationList = delegationRepository.findAll();
        assertThat(delegationList).hasSize(databaseSizeBeforeUpdate);
        Delegation testDelegation = delegationList.get(delegationList.size() - 1);
        assertThat(testDelegation.getFrom()).isEqualTo(UPDATED_FROM);
        assertThat(testDelegation.getTo()).isEqualTo(UPDATED_TO);
        assertThat(testDelegation.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testDelegation.getDelegateId()).isEqualTo(UPDATED_DELEGATE_ID);
        assertThat(testDelegation.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testDelegation.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testDelegation.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testDelegation.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
        assertThat(testDelegation.getLastModifiedDate()).isEqualTo(UPDATED_LAST_MODIFIED_DATE);

        // Validate the Delegation in Elasticsearch
        verify(mockDelegationSearchRepository, times(1)).save(testDelegation);
    }

    @Test
    @Transactional
    public void updateNonExistingDelegation() throws Exception {
        int databaseSizeBeforeUpdate = delegationRepository.findAll().size();

        // Create the Delegation
        DelegationDTO delegationDTO = delegationMapper.toDto(delegation);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDelegationMockMvc.perform(put("/api/delegations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(delegationDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Delegation in the database
        List<Delegation> delegationList = delegationRepository.findAll();
        assertThat(delegationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Delegation in Elasticsearch
        verify(mockDelegationSearchRepository, times(0)).save(delegation);
    }

    @Test
    @Transactional
    public void deleteDelegation() throws Exception {
        // Initialize the database
        delegationRepository.saveAndFlush(delegation);

        int databaseSizeBeforeDelete = delegationRepository.findAll().size();

        // Delete the delegation
        restDelegationMockMvc.perform(delete("/api/delegations/{id}", delegation.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Delegation> delegationList = delegationRepository.findAll();
        assertThat(delegationList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Delegation in Elasticsearch
        verify(mockDelegationSearchRepository, times(1)).deleteById(delegation.getId());
    }

    @Test
    @Transactional
    public void searchDelegation() throws Exception {
        // Initialize the database
        delegationRepository.saveAndFlush(delegation);
        when(mockDelegationSearchRepository.search(queryStringQuery("id:" + delegation.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(delegation), PageRequest.of(0, 1), 1));
        // Search the delegation
        restDelegationMockMvc.perform(get("/api/_search/delegations?query=id:" + delegation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(delegation.getId().intValue())))
            .andExpect(jsonPath("$.[*].from").value(hasItem(sameInstant(DEFAULT_FROM))))
            .andExpect(jsonPath("$.[*].to").value(hasItem(sameInstant(DEFAULT_TO))))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].delegateId").value(hasItem(DEFAULT_DELEGATE_ID)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(sameInstant(DEFAULT_LAST_MODIFIED_DATE))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Delegation.class);
        Delegation delegation1 = new Delegation();
        delegation1.setId(1L);
        Delegation delegation2 = new Delegation();
        delegation2.setId(delegation1.getId());
        assertThat(delegation1).isEqualTo(delegation2);
        delegation2.setId(2L);
        assertThat(delegation1).isNotEqualTo(delegation2);
        delegation1.setId(null);
        assertThat(delegation1).isNotEqualTo(delegation2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(DelegationDTO.class);
        DelegationDTO delegationDTO1 = new DelegationDTO();
        delegationDTO1.setId(1L);
        DelegationDTO delegationDTO2 = new DelegationDTO();
        assertThat(delegationDTO1).isNotEqualTo(delegationDTO2);
        delegationDTO2.setId(delegationDTO1.getId());
        assertThat(delegationDTO1).isEqualTo(delegationDTO2);
        delegationDTO2.setId(2L);
        assertThat(delegationDTO1).isNotEqualTo(delegationDTO2);
        delegationDTO1.setId(null);
        assertThat(delegationDTO1).isNotEqualTo(delegationDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(delegationMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(delegationMapper.fromId(null)).isNull();
    }
}
