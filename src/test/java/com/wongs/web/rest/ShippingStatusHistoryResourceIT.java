package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.ShippingStatusHistory;
import com.wongs.repository.ShippingStatusHistoryRepository;
import com.wongs.repository.search.ShippingStatusHistorySearchRepository;
import com.wongs.service.ShippingStatusHistoryService;
import com.wongs.service.dto.ShippingStatusHistoryDTO;
import com.wongs.service.mapper.ShippingStatusHistoryMapper;

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
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

import static com.wongs.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wongs.domain.enumeration.ShippingStatus;
/**
 * Integration tests for the {@link ShippingStatusHistoryResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class ShippingStatusHistoryResourceIT {

    private static final ZonedDateTime DEFAULT_EFFECTIVE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_EFFECTIVE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ShippingStatus DEFAULT_STATUS = ShippingStatus.PENDING;
    private static final ShippingStatus UPDATED_STATUS = ShippingStatus.SHIPPED;

    @Autowired
    private ShippingStatusHistoryRepository shippingStatusHistoryRepository;

    @Autowired
    private ShippingStatusHistoryMapper shippingStatusHistoryMapper;

    @Autowired
    private ShippingStatusHistoryService shippingStatusHistoryService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.ShippingStatusHistorySearchRepositoryMockConfiguration
     */
    @Autowired
    private ShippingStatusHistorySearchRepository mockShippingStatusHistorySearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShippingStatusHistoryMockMvc;

    private ShippingStatusHistory shippingStatusHistory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShippingStatusHistory createEntity(EntityManager em) {
        ShippingStatusHistory shippingStatusHistory = new ShippingStatusHistory()
            .effectiveDate(DEFAULT_EFFECTIVE_DATE)
            .status(DEFAULT_STATUS);
        return shippingStatusHistory;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShippingStatusHistory createUpdatedEntity(EntityManager em) {
        ShippingStatusHistory shippingStatusHistory = new ShippingStatusHistory()
            .effectiveDate(UPDATED_EFFECTIVE_DATE)
            .status(UPDATED_STATUS);
        return shippingStatusHistory;
    }

    @BeforeEach
    public void initTest() {
        shippingStatusHistory = createEntity(em);
    }

    @Test
    @Transactional
    public void createShippingStatusHistory() throws Exception {
        int databaseSizeBeforeCreate = shippingStatusHistoryRepository.findAll().size();

        // Create the ShippingStatusHistory
        ShippingStatusHistoryDTO shippingStatusHistoryDTO = shippingStatusHistoryMapper.toDto(shippingStatusHistory);
        restShippingStatusHistoryMockMvc.perform(post("/api/shipping-status-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shippingStatusHistoryDTO)))
            .andExpect(status().isCreated());

        // Validate the ShippingStatusHistory in the database
        List<ShippingStatusHistory> shippingStatusHistoryList = shippingStatusHistoryRepository.findAll();
        assertThat(shippingStatusHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        ShippingStatusHistory testShippingStatusHistory = shippingStatusHistoryList.get(shippingStatusHistoryList.size() - 1);
        assertThat(testShippingStatusHistory.getEffectiveDate()).isEqualTo(DEFAULT_EFFECTIVE_DATE);
        assertThat(testShippingStatusHistory.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the ShippingStatusHistory in Elasticsearch
        verify(mockShippingStatusHistorySearchRepository, times(1)).save(testShippingStatusHistory);
    }

    @Test
    @Transactional
    public void createShippingStatusHistoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = shippingStatusHistoryRepository.findAll().size();

        // Create the ShippingStatusHistory with an existing ID
        shippingStatusHistory.setId(1L);
        ShippingStatusHistoryDTO shippingStatusHistoryDTO = shippingStatusHistoryMapper.toDto(shippingStatusHistory);

        // An entity with an existing ID cannot be created, so this API call must fail
        restShippingStatusHistoryMockMvc.perform(post("/api/shipping-status-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shippingStatusHistoryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ShippingStatusHistory in the database
        List<ShippingStatusHistory> shippingStatusHistoryList = shippingStatusHistoryRepository.findAll();
        assertThat(shippingStatusHistoryList).hasSize(databaseSizeBeforeCreate);

        // Validate the ShippingStatusHistory in Elasticsearch
        verify(mockShippingStatusHistorySearchRepository, times(0)).save(shippingStatusHistory);
    }


    @Test
    @Transactional
    public void getAllShippingStatusHistories() throws Exception {
        // Initialize the database
        shippingStatusHistoryRepository.saveAndFlush(shippingStatusHistory);

        // Get all the shippingStatusHistoryList
        restShippingStatusHistoryMockMvc.perform(get("/api/shipping-status-histories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shippingStatusHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].effectiveDate").value(hasItem(sameInstant(DEFAULT_EFFECTIVE_DATE))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
    
    @Test
    @Transactional
    public void getShippingStatusHistory() throws Exception {
        // Initialize the database
        shippingStatusHistoryRepository.saveAndFlush(shippingStatusHistory);

        // Get the shippingStatusHistory
        restShippingStatusHistoryMockMvc.perform(get("/api/shipping-status-histories/{id}", shippingStatusHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shippingStatusHistory.getId().intValue()))
            .andExpect(jsonPath("$.effectiveDate").value(sameInstant(DEFAULT_EFFECTIVE_DATE)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingShippingStatusHistory() throws Exception {
        // Get the shippingStatusHistory
        restShippingStatusHistoryMockMvc.perform(get("/api/shipping-status-histories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateShippingStatusHistory() throws Exception {
        // Initialize the database
        shippingStatusHistoryRepository.saveAndFlush(shippingStatusHistory);

        int databaseSizeBeforeUpdate = shippingStatusHistoryRepository.findAll().size();

        // Update the shippingStatusHistory
        ShippingStatusHistory updatedShippingStatusHistory = shippingStatusHistoryRepository.findById(shippingStatusHistory.getId()).get();
        // Disconnect from session so that the updates on updatedShippingStatusHistory are not directly saved in db
        em.detach(updatedShippingStatusHistory);
        updatedShippingStatusHistory
            .effectiveDate(UPDATED_EFFECTIVE_DATE)
            .status(UPDATED_STATUS);
        ShippingStatusHistoryDTO shippingStatusHistoryDTO = shippingStatusHistoryMapper.toDto(updatedShippingStatusHistory);

        restShippingStatusHistoryMockMvc.perform(put("/api/shipping-status-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shippingStatusHistoryDTO)))
            .andExpect(status().isOk());

        // Validate the ShippingStatusHistory in the database
        List<ShippingStatusHistory> shippingStatusHistoryList = shippingStatusHistoryRepository.findAll();
        assertThat(shippingStatusHistoryList).hasSize(databaseSizeBeforeUpdate);
        ShippingStatusHistory testShippingStatusHistory = shippingStatusHistoryList.get(shippingStatusHistoryList.size() - 1);
        assertThat(testShippingStatusHistory.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
        assertThat(testShippingStatusHistory.getStatus()).isEqualTo(UPDATED_STATUS);

        // Validate the ShippingStatusHistory in Elasticsearch
        verify(mockShippingStatusHistorySearchRepository, times(1)).save(testShippingStatusHistory);
    }

    @Test
    @Transactional
    public void updateNonExistingShippingStatusHistory() throws Exception {
        int databaseSizeBeforeUpdate = shippingStatusHistoryRepository.findAll().size();

        // Create the ShippingStatusHistory
        ShippingStatusHistoryDTO shippingStatusHistoryDTO = shippingStatusHistoryMapper.toDto(shippingStatusHistory);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShippingStatusHistoryMockMvc.perform(put("/api/shipping-status-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shippingStatusHistoryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ShippingStatusHistory in the database
        List<ShippingStatusHistory> shippingStatusHistoryList = shippingStatusHistoryRepository.findAll();
        assertThat(shippingStatusHistoryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ShippingStatusHistory in Elasticsearch
        verify(mockShippingStatusHistorySearchRepository, times(0)).save(shippingStatusHistory);
    }

    @Test
    @Transactional
    public void deleteShippingStatusHistory() throws Exception {
        // Initialize the database
        shippingStatusHistoryRepository.saveAndFlush(shippingStatusHistory);

        int databaseSizeBeforeDelete = shippingStatusHistoryRepository.findAll().size();

        // Delete the shippingStatusHistory
        restShippingStatusHistoryMockMvc.perform(delete("/api/shipping-status-histories/{id}", shippingStatusHistory.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ShippingStatusHistory> shippingStatusHistoryList = shippingStatusHistoryRepository.findAll();
        assertThat(shippingStatusHistoryList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ShippingStatusHistory in Elasticsearch
        verify(mockShippingStatusHistorySearchRepository, times(1)).deleteById(shippingStatusHistory.getId());
    }

    @Test
    @Transactional
    public void searchShippingStatusHistory() throws Exception {
        // Initialize the database
        shippingStatusHistoryRepository.saveAndFlush(shippingStatusHistory);
        when(mockShippingStatusHistorySearchRepository.search(queryStringQuery("id:" + shippingStatusHistory.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(shippingStatusHistory), PageRequest.of(0, 1), 1));
        // Search the shippingStatusHistory
        restShippingStatusHistoryMockMvc.perform(get("/api/_search/shipping-status-histories?query=id:" + shippingStatusHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shippingStatusHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].effectiveDate").value(hasItem(sameInstant(DEFAULT_EFFECTIVE_DATE))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
}
