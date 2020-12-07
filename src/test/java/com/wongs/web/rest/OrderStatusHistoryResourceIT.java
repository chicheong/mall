package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.OrderStatusHistory;
import com.wongs.repository.OrderStatusHistoryRepository;
import com.wongs.repository.search.OrderStatusHistorySearchRepository;
import com.wongs.service.OrderStatusHistoryService;
import com.wongs.service.dto.OrderStatusHistoryDTO;
import com.wongs.service.mapper.OrderStatusHistoryMapper;

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

import com.wongs.domain.enumeration.OrderStatus;
/**
 * Integration tests for the {@link OrderStatusHistoryResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class OrderStatusHistoryResourceIT {

    private static final ZonedDateTime DEFAULT_EFFECTIVE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_EFFECTIVE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final OrderStatus DEFAULT_STATUS = OrderStatus.PENDING;
    private static final OrderStatus UPDATED_STATUS = OrderStatus.CHECKOUT;

    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    private OrderStatusHistoryMapper orderStatusHistoryMapper;

    @Autowired
    private OrderStatusHistoryService orderStatusHistoryService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.OrderStatusHistorySearchRepositoryMockConfiguration
     */
    @Autowired
    private OrderStatusHistorySearchRepository mockOrderStatusHistorySearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrderStatusHistoryMockMvc;

    private OrderStatusHistory orderStatusHistory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderStatusHistory createEntity(EntityManager em) {
        OrderStatusHistory orderStatusHistory = new OrderStatusHistory()
            .effectiveDate(DEFAULT_EFFECTIVE_DATE)
            .status(DEFAULT_STATUS);
        return orderStatusHistory;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderStatusHistory createUpdatedEntity(EntityManager em) {
        OrderStatusHistory orderStatusHistory = new OrderStatusHistory()
            .effectiveDate(UPDATED_EFFECTIVE_DATE)
            .status(UPDATED_STATUS);
        return orderStatusHistory;
    }

    @BeforeEach
    public void initTest() {
        orderStatusHistory = createEntity(em);
    }

    @Test
    @Transactional
    public void createOrderStatusHistory() throws Exception {
        int databaseSizeBeforeCreate = orderStatusHistoryRepository.findAll().size();

        // Create the OrderStatusHistory
        OrderStatusHistoryDTO orderStatusHistoryDTO = orderStatusHistoryMapper.toDto(orderStatusHistory);
        restOrderStatusHistoryMockMvc.perform(post("/api/order-status-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(orderStatusHistoryDTO)))
            .andExpect(status().isCreated());

        // Validate the OrderStatusHistory in the database
        List<OrderStatusHistory> orderStatusHistoryList = orderStatusHistoryRepository.findAll();
        assertThat(orderStatusHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        OrderStatusHistory testOrderStatusHistory = orderStatusHistoryList.get(orderStatusHistoryList.size() - 1);
        assertThat(testOrderStatusHistory.getEffectiveDate()).isEqualTo(DEFAULT_EFFECTIVE_DATE);
        assertThat(testOrderStatusHistory.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the OrderStatusHistory in Elasticsearch
        verify(mockOrderStatusHistorySearchRepository, times(1)).save(testOrderStatusHistory);
    }

    @Test
    @Transactional
    public void createOrderStatusHistoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = orderStatusHistoryRepository.findAll().size();

        // Create the OrderStatusHistory with an existing ID
        orderStatusHistory.setId(1L);
        OrderStatusHistoryDTO orderStatusHistoryDTO = orderStatusHistoryMapper.toDto(orderStatusHistory);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderStatusHistoryMockMvc.perform(post("/api/order-status-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(orderStatusHistoryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the OrderStatusHistory in the database
        List<OrderStatusHistory> orderStatusHistoryList = orderStatusHistoryRepository.findAll();
        assertThat(orderStatusHistoryList).hasSize(databaseSizeBeforeCreate);

        // Validate the OrderStatusHistory in Elasticsearch
        verify(mockOrderStatusHistorySearchRepository, times(0)).save(orderStatusHistory);
    }


    @Test
    @Transactional
    public void getAllOrderStatusHistories() throws Exception {
        // Initialize the database
        orderStatusHistoryRepository.saveAndFlush(orderStatusHistory);

        // Get all the orderStatusHistoryList
        restOrderStatusHistoryMockMvc.perform(get("/api/order-status-histories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderStatusHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].effectiveDate").value(hasItem(sameInstant(DEFAULT_EFFECTIVE_DATE))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
    
    @Test
    @Transactional
    public void getOrderStatusHistory() throws Exception {
        // Initialize the database
        orderStatusHistoryRepository.saveAndFlush(orderStatusHistory);

        // Get the orderStatusHistory
        restOrderStatusHistoryMockMvc.perform(get("/api/order-status-histories/{id}", orderStatusHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(orderStatusHistory.getId().intValue()))
            .andExpect(jsonPath("$.effectiveDate").value(sameInstant(DEFAULT_EFFECTIVE_DATE)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingOrderStatusHistory() throws Exception {
        // Get the orderStatusHistory
        restOrderStatusHistoryMockMvc.perform(get("/api/order-status-histories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOrderStatusHistory() throws Exception {
        // Initialize the database
        orderStatusHistoryRepository.saveAndFlush(orderStatusHistory);

        int databaseSizeBeforeUpdate = orderStatusHistoryRepository.findAll().size();

        // Update the orderStatusHistory
        OrderStatusHistory updatedOrderStatusHistory = orderStatusHistoryRepository.findById(orderStatusHistory.getId()).get();
        // Disconnect from session so that the updates on updatedOrderStatusHistory are not directly saved in db
        em.detach(updatedOrderStatusHistory);
        updatedOrderStatusHistory
            .effectiveDate(UPDATED_EFFECTIVE_DATE)
            .status(UPDATED_STATUS);
        OrderStatusHistoryDTO orderStatusHistoryDTO = orderStatusHistoryMapper.toDto(updatedOrderStatusHistory);

        restOrderStatusHistoryMockMvc.perform(put("/api/order-status-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(orderStatusHistoryDTO)))
            .andExpect(status().isOk());

        // Validate the OrderStatusHistory in the database
        List<OrderStatusHistory> orderStatusHistoryList = orderStatusHistoryRepository.findAll();
        assertThat(orderStatusHistoryList).hasSize(databaseSizeBeforeUpdate);
        OrderStatusHistory testOrderStatusHistory = orderStatusHistoryList.get(orderStatusHistoryList.size() - 1);
        assertThat(testOrderStatusHistory.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
        assertThat(testOrderStatusHistory.getStatus()).isEqualTo(UPDATED_STATUS);

        // Validate the OrderStatusHistory in Elasticsearch
        verify(mockOrderStatusHistorySearchRepository, times(1)).save(testOrderStatusHistory);
    }

    @Test
    @Transactional
    public void updateNonExistingOrderStatusHistory() throws Exception {
        int databaseSizeBeforeUpdate = orderStatusHistoryRepository.findAll().size();

        // Create the OrderStatusHistory
        OrderStatusHistoryDTO orderStatusHistoryDTO = orderStatusHistoryMapper.toDto(orderStatusHistory);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderStatusHistoryMockMvc.perform(put("/api/order-status-histories")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(orderStatusHistoryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the OrderStatusHistory in the database
        List<OrderStatusHistory> orderStatusHistoryList = orderStatusHistoryRepository.findAll();
        assertThat(orderStatusHistoryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the OrderStatusHistory in Elasticsearch
        verify(mockOrderStatusHistorySearchRepository, times(0)).save(orderStatusHistory);
    }

    @Test
    @Transactional
    public void deleteOrderStatusHistory() throws Exception {
        // Initialize the database
        orderStatusHistoryRepository.saveAndFlush(orderStatusHistory);

        int databaseSizeBeforeDelete = orderStatusHistoryRepository.findAll().size();

        // Delete the orderStatusHistory
        restOrderStatusHistoryMockMvc.perform(delete("/api/order-status-histories/{id}", orderStatusHistory.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrderStatusHistory> orderStatusHistoryList = orderStatusHistoryRepository.findAll();
        assertThat(orderStatusHistoryList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the OrderStatusHistory in Elasticsearch
        verify(mockOrderStatusHistorySearchRepository, times(1)).deleteById(orderStatusHistory.getId());
    }

    @Test
    @Transactional
    public void searchOrderStatusHistory() throws Exception {
        // Initialize the database
        orderStatusHistoryRepository.saveAndFlush(orderStatusHistory);
        when(mockOrderStatusHistorySearchRepository.search(queryStringQuery("id:" + orderStatusHistory.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(orderStatusHistory), PageRequest.of(0, 1), 1));
        // Search the orderStatusHistory
        restOrderStatusHistoryMockMvc.perform(get("/api/_search/order-status-histories?query=id:" + orderStatusHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderStatusHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].effectiveDate").value(hasItem(sameInstant(DEFAULT_EFFECTIVE_DATE))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
}
