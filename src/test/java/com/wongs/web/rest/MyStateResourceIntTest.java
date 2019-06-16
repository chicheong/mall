package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.MyState;
import com.wongs.repository.MyStateRepository;
import com.wongs.repository.search.MyStateSearchRepository;
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

/**
 * Test class for the MyStateResource REST controller.
 *
 * @see MyStateResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class MyStateResourceIntTest {

    private static final String DEFAULT_CODE = "AA";
    private static final String UPDATED_CODE = "BB";

    private static final String DEFAULT_LABEL = "AAA";
    private static final String UPDATED_LABEL = "BBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private MyStateRepository myStateRepository;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.MyStateSearchRepositoryMockConfiguration
     */
    @Autowired
    private MyStateSearchRepository mockMyStateSearchRepository;

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

    private MockMvc restMyStateMockMvc;

    private MyState myState;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MyStateResource myStateResource = new MyStateResource(myStateRepository, mockMyStateSearchRepository);
        this.restMyStateMockMvc = MockMvcBuilders.standaloneSetup(myStateResource)
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
    public static MyState createEntity(EntityManager em) {
        MyState myState = new MyState()
            .code(DEFAULT_CODE)
            .label(DEFAULT_LABEL)
            .name(DEFAULT_NAME);
        return myState;
    }

    @Before
    public void initTest() {
        myState = createEntity(em);
    }

    @Test
    @Transactional
    public void createMyState() throws Exception {
        int databaseSizeBeforeCreate = myStateRepository.findAll().size();

        // Create the MyState
        restMyStateMockMvc.perform(post("/api/my-states")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myState)))
            .andExpect(status().isCreated());

        // Validate the MyState in the database
        List<MyState> myStateList = myStateRepository.findAll();
        assertThat(myStateList).hasSize(databaseSizeBeforeCreate + 1);
        MyState testMyState = myStateList.get(myStateList.size() - 1);
        assertThat(testMyState.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testMyState.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testMyState.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the MyState in Elasticsearch
        verify(mockMyStateSearchRepository, times(1)).save(testMyState);
    }

    @Test
    @Transactional
    public void createMyStateWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = myStateRepository.findAll().size();

        // Create the MyState with an existing ID
        myState.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMyStateMockMvc.perform(post("/api/my-states")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myState)))
            .andExpect(status().isBadRequest());

        // Validate the MyState in the database
        List<MyState> myStateList = myStateRepository.findAll();
        assertThat(myStateList).hasSize(databaseSizeBeforeCreate);

        // Validate the MyState in Elasticsearch
        verify(mockMyStateSearchRepository, times(0)).save(myState);
    }

    @Test
    @Transactional
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = myStateRepository.findAll().size();
        // set the field null
        myState.setCode(null);

        // Create the MyState, which fails.

        restMyStateMockMvc.perform(post("/api/my-states")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myState)))
            .andExpect(status().isBadRequest());

        List<MyState> myStateList = myStateRepository.findAll();
        assertThat(myStateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllMyStates() throws Exception {
        // Initialize the database
        myStateRepository.saveAndFlush(myState);

        // Get all the myStateList
        restMyStateMockMvc.perform(get("/api/my-states?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myState.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getMyState() throws Exception {
        // Initialize the database
        myStateRepository.saveAndFlush(myState);

        // Get the myState
        restMyStateMockMvc.perform(get("/api/my-states/{id}", myState.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(myState.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMyState() throws Exception {
        // Get the myState
        restMyStateMockMvc.perform(get("/api/my-states/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMyState() throws Exception {
        // Initialize the database
        myStateRepository.saveAndFlush(myState);

        int databaseSizeBeforeUpdate = myStateRepository.findAll().size();

        // Update the myState
        MyState updatedMyState = myStateRepository.findById(myState.getId()).get();
        // Disconnect from session so that the updates on updatedMyState are not directly saved in db
        em.detach(updatedMyState);
        updatedMyState
            .code(UPDATED_CODE)
            .label(UPDATED_LABEL)
            .name(UPDATED_NAME);

        restMyStateMockMvc.perform(put("/api/my-states")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMyState)))
            .andExpect(status().isOk());

        // Validate the MyState in the database
        List<MyState> myStateList = myStateRepository.findAll();
        assertThat(myStateList).hasSize(databaseSizeBeforeUpdate);
        MyState testMyState = myStateList.get(myStateList.size() - 1);
        assertThat(testMyState.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testMyState.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testMyState.getName()).isEqualTo(UPDATED_NAME);

        // Validate the MyState in Elasticsearch
        verify(mockMyStateSearchRepository, times(1)).save(testMyState);
    }

    @Test
    @Transactional
    public void updateNonExistingMyState() throws Exception {
        int databaseSizeBeforeUpdate = myStateRepository.findAll().size();

        // Create the MyState

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMyStateMockMvc.perform(put("/api/my-states")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myState)))
            .andExpect(status().isBadRequest());

        // Validate the MyState in the database
        List<MyState> myStateList = myStateRepository.findAll();
        assertThat(myStateList).hasSize(databaseSizeBeforeUpdate);

        // Validate the MyState in Elasticsearch
        verify(mockMyStateSearchRepository, times(0)).save(myState);
    }

    @Test
    @Transactional
    public void deleteMyState() throws Exception {
        // Initialize the database
        myStateRepository.saveAndFlush(myState);

        int databaseSizeBeforeDelete = myStateRepository.findAll().size();

        // Delete the myState
        restMyStateMockMvc.perform(delete("/api/my-states/{id}", myState.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<MyState> myStateList = myStateRepository.findAll();
        assertThat(myStateList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the MyState in Elasticsearch
        verify(mockMyStateSearchRepository, times(1)).deleteById(myState.getId());
    }

    @Test
    @Transactional
    public void searchMyState() throws Exception {
        // Initialize the database
        myStateRepository.saveAndFlush(myState);
        when(mockMyStateSearchRepository.search(queryStringQuery("id:" + myState.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(myState), PageRequest.of(0, 1), 1));
        // Search the myState
        restMyStateMockMvc.perform(get("/api/_search/my-states?query=id:" + myState.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myState.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MyState.class);
        MyState myState1 = new MyState();
        myState1.setId(1L);
        MyState myState2 = new MyState();
        myState2.setId(myState1.getId());
        assertThat(myState1).isEqualTo(myState2);
        myState2.setId(2L);
        assertThat(myState1).isNotEqualTo(myState2);
        myState1.setId(null);
        assertThat(myState1).isNotEqualTo(myState2);
    }
}
