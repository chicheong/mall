package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.MyState;
import com.wongs.repository.MyStateRepository;
import com.wongs.repository.search.MyStateSearchRepository;
import com.wongs.service.MyStateService;
import com.wongs.service.dto.MyStateDTO;
import com.wongs.service.mapper.MyStateMapper;

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
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link MyStateResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class MyStateResourceIT {

    private static final String DEFAULT_CODE = "AA";
    private static final String UPDATED_CODE = "BB";

    private static final String DEFAULT_LABEL = "AAA";
    private static final String UPDATED_LABEL = "BBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private MyStateRepository myStateRepository;

    @Autowired
    private MyStateMapper myStateMapper;

    @Autowired
    private MyStateService myStateService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.MyStateSearchRepositoryMockConfiguration
     */
    @Autowired
    private MyStateSearchRepository mockMyStateSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMyStateMockMvc;

    private MyState myState;

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
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MyState createUpdatedEntity(EntityManager em) {
        MyState myState = new MyState()
            .code(UPDATED_CODE)
            .label(UPDATED_LABEL)
            .name(UPDATED_NAME);
        return myState;
    }

    @BeforeEach
    public void initTest() {
        myState = createEntity(em);
    }

    @Test
    @Transactional
    public void createMyState() throws Exception {
        int databaseSizeBeforeCreate = myStateRepository.findAll().size();

        // Create the MyState
        MyStateDTO myStateDTO = myStateMapper.toDto(myState);
        restMyStateMockMvc.perform(post("/api/my-states")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(myStateDTO)))
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
        MyStateDTO myStateDTO = myStateMapper.toDto(myState);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMyStateMockMvc.perform(post("/api/my-states")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(myStateDTO)))
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
        MyStateDTO myStateDTO = myStateMapper.toDto(myState);

        restMyStateMockMvc.perform(post("/api/my-states")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(myStateDTO)))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myState.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }
    
    @Test
    @Transactional
    public void getMyState() throws Exception {
        // Initialize the database
        myStateRepository.saveAndFlush(myState);

        // Get the myState
        restMyStateMockMvc.perform(get("/api/my-states/{id}", myState.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(myState.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
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
        MyStateDTO myStateDTO = myStateMapper.toDto(updatedMyState);

        restMyStateMockMvc.perform(put("/api/my-states")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(myStateDTO)))
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
        MyStateDTO myStateDTO = myStateMapper.toDto(myState);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMyStateMockMvc.perform(put("/api/my-states")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(myStateDTO)))
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
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myState.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }
}
