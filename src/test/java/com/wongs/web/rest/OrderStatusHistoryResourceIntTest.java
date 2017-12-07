package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.OrderStatusHistory;
import com.wongs.repository.OrderStatusHistoryRepository;
import com.wongs.repository.search.OrderStatusHistorySearchRepository;
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
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.wongs.web.rest.TestUtil.sameInstant;
import static com.wongs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wongs.domain.enumeration.OrderStatus;
/**
 * Test class for the OrderStatusHistoryResource REST controller.
 *
 * @see OrderStatusHistoryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class OrderStatusHistoryResourceIntTest {

    private static final ZonedDateTime DEFAULT_EFFECTIVE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_EFFECTIVE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final OrderStatus DEFAULT_STATUS = OrderStatus.PENDING;
    private static final OrderStatus UPDATED_STATUS = OrderStatus.COMFIRMED;

    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    private OrderStatusHistorySearchRepository orderStatusHistorySearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restOrderStatusHistoryMockMvc;

    private OrderStatusHistory orderStatusHistory;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OrderStatusHistoryResource orderStatusHistoryResource = new OrderStatusHistoryResource(orderStatusHistoryRepository, orderStatusHistorySearchRepository);
        this.restOrderStatusHistoryMockMvc = MockMvcBuilders.standaloneSetup(orderStatusHistoryResource)
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
    public static OrderStatusHistory createEntity(EntityManager em) {
        OrderStatusHistory orderStatusHistory = new OrderStatusHistory()
            .effectiveDate(DEFAULT_EFFECTIVE_DATE)
            .status(DEFAULT_STATUS);
        return orderStatusHistory;
    }

    @Before
    public void initTest() {
        orderStatusHistorySearchRepository.deleteAll();
        orderStatusHistory = createEntity(em);
    }

    @Test
    @Transactional
    public void createOrderStatusHistory() throws Exception {
        int databaseSizeBeforeCreate = orderStatusHistoryRepository.findAll().size();

        // Create the OrderStatusHistory
        restOrderStatusHistoryMockMvc.perform(post("/api/order-status-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderStatusHistory)))
            .andExpect(status().isCreated());

        // Validate the OrderStatusHistory in the database
        List<OrderStatusHistory> orderStatusHistoryList = orderStatusHistoryRepository.findAll();
        assertThat(orderStatusHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        OrderStatusHistory testOrderStatusHistory = orderStatusHistoryList.get(orderStatusHistoryList.size() - 1);
        assertThat(testOrderStatusHistory.getEffectiveDate()).isEqualTo(DEFAULT_EFFECTIVE_DATE);
        assertThat(testOrderStatusHistory.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the OrderStatusHistory in Elasticsearch
        OrderStatusHistory orderStatusHistoryEs = orderStatusHistorySearchRepository.findOne(testOrderStatusHistory.getId());
        assertThat(orderStatusHistoryEs).isEqualToComparingFieldByField(testOrderStatusHistory);
    }

    @Test
    @Transactional
    public void createOrderStatusHistoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = orderStatusHistoryRepository.findAll().size();

        // Create the OrderStatusHistory with an existing ID
        orderStatusHistory.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderStatusHistoryMockMvc.perform(post("/api/order-status-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderStatusHistory)))
            .andExpect(status().isBadRequest());

        // Validate the OrderStatusHistory in the database
        List<OrderStatusHistory> orderStatusHistoryList = orderStatusHistoryRepository.findAll();
        assertThat(orderStatusHistoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllOrderStatusHistories() throws Exception {
        // Initialize the database
        orderStatusHistoryRepository.saveAndFlush(orderStatusHistory);

        // Get all the orderStatusHistoryList
        restOrderStatusHistoryMockMvc.perform(get("/api/order-status-histories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
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
        orderStatusHistorySearchRepository.save(orderStatusHistory);
        int databaseSizeBeforeUpdate = orderStatusHistoryRepository.findAll().size();

        // Update the orderStatusHistory
        OrderStatusHistory updatedOrderStatusHistory = orderStatusHistoryRepository.findOne(orderStatusHistory.getId());
        // Disconnect from session so that the updates on updatedOrderStatusHistory are not directly saved in db
        em.detach(updatedOrderStatusHistory);
        updatedOrderStatusHistory
            .effectiveDate(UPDATED_EFFECTIVE_DATE)
            .status(UPDATED_STATUS);

        restOrderStatusHistoryMockMvc.perform(put("/api/order-status-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOrderStatusHistory)))
            .andExpect(status().isOk());

        // Validate the OrderStatusHistory in the database
        List<OrderStatusHistory> orderStatusHistoryList = orderStatusHistoryRepository.findAll();
        assertThat(orderStatusHistoryList).hasSize(databaseSizeBeforeUpdate);
        OrderStatusHistory testOrderStatusHistory = orderStatusHistoryList.get(orderStatusHistoryList.size() - 1);
        assertThat(testOrderStatusHistory.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
        assertThat(testOrderStatusHistory.getStatus()).isEqualTo(UPDATED_STATUS);

        // Validate the OrderStatusHistory in Elasticsearch
        OrderStatusHistory orderStatusHistoryEs = orderStatusHistorySearchRepository.findOne(testOrderStatusHistory.getId());
        assertThat(orderStatusHistoryEs).isEqualToComparingFieldByField(testOrderStatusHistory);
    }

    @Test
    @Transactional
    public void updateNonExistingOrderStatusHistory() throws Exception {
        int databaseSizeBeforeUpdate = orderStatusHistoryRepository.findAll().size();

        // Create the OrderStatusHistory

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restOrderStatusHistoryMockMvc.perform(put("/api/order-status-histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderStatusHistory)))
            .andExpect(status().isCreated());

        // Validate the OrderStatusHistory in the database
        List<OrderStatusHistory> orderStatusHistoryList = orderStatusHistoryRepository.findAll();
        assertThat(orderStatusHistoryList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteOrderStatusHistory() throws Exception {
        // Initialize the database
        orderStatusHistoryRepository.saveAndFlush(orderStatusHistory);
        orderStatusHistorySearchRepository.save(orderStatusHistory);
        int databaseSizeBeforeDelete = orderStatusHistoryRepository.findAll().size();

        // Get the orderStatusHistory
        restOrderStatusHistoryMockMvc.perform(delete("/api/order-status-histories/{id}", orderStatusHistory.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean orderStatusHistoryExistsInEs = orderStatusHistorySearchRepository.exists(orderStatusHistory.getId());
        assertThat(orderStatusHistoryExistsInEs).isFalse();

        // Validate the database is empty
        List<OrderStatusHistory> orderStatusHistoryList = orderStatusHistoryRepository.findAll();
        assertThat(orderStatusHistoryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchOrderStatusHistory() throws Exception {
        // Initialize the database
        orderStatusHistoryRepository.saveAndFlush(orderStatusHistory);
        orderStatusHistorySearchRepository.save(orderStatusHistory);

        // Search the orderStatusHistory
        restOrderStatusHistoryMockMvc.perform(get("/api/_search/order-status-histories?query=id:" + orderStatusHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderStatusHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].effectiveDate").value(hasItem(sameInstant(DEFAULT_EFFECTIVE_DATE))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderStatusHistory.class);
        OrderStatusHistory orderStatusHistory1 = new OrderStatusHistory();
        orderStatusHistory1.setId(1L);
        OrderStatusHistory orderStatusHistory2 = new OrderStatusHistory();
        orderStatusHistory2.setId(orderStatusHistory1.getId());
        assertThat(orderStatusHistory1).isEqualTo(orderStatusHistory2);
        orderStatusHistory2.setId(2L);
        assertThat(orderStatusHistory1).isNotEqualTo(orderStatusHistory2);
        orderStatusHistory1.setId(null);
        assertThat(orderStatusHistory1).isNotEqualTo(orderStatusHistory2);
    }
}
