package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.MyOrder;
import com.wongs.repository.MyOrderRepository;
import com.wongs.repository.search.MyOrderSearchRepository;
import com.wongs.service.MyOrderService;
import com.wongs.service.dto.MyOrderDTO;
import com.wongs.service.mapper.MyOrderMapper;

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

import com.wongs.domain.enumeration.CurrencyType;
import com.wongs.domain.enumeration.OrderStatus;
/**
 * Integration tests for the {@link MyOrderResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class MyOrderResourceIT {

    private static final BigDecimal DEFAULT_TOTAL = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL = new BigDecimal(2);

    private static final CurrencyType DEFAULT_CURRENCY = CurrencyType.HKD;
    private static final CurrencyType UPDATED_CURRENCY = CurrencyType.CNY;

    private static final String DEFAULT_REMARK = "AAAAAAAAAA";
    private static final String UPDATED_REMARK = "BBBBBBBBBB";

    private static final OrderStatus DEFAULT_STATUS = OrderStatus.PENDING;
    private static final OrderStatus UPDATED_STATUS = OrderStatus.CHECKOUT;

    @Autowired
    private MyOrderRepository myOrderRepository;

    @Autowired
    private MyOrderMapper myOrderMapper;

    @Autowired
    private MyOrderService myOrderService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.MyOrderSearchRepositoryMockConfiguration
     */
    @Autowired
    private MyOrderSearchRepository mockMyOrderSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMyOrderMockMvc;

    private MyOrder myOrder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MyOrder createEntity(EntityManager em) {
        MyOrder myOrder = new MyOrder()
            .total(DEFAULT_TOTAL)
            .currency(DEFAULT_CURRENCY)
            .remark(DEFAULT_REMARK)
            .status(DEFAULT_STATUS);
        return myOrder;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MyOrder createUpdatedEntity(EntityManager em) {
        MyOrder myOrder = new MyOrder()
            .total(UPDATED_TOTAL)
            .currency(UPDATED_CURRENCY)
            .remark(UPDATED_REMARK)
            .status(UPDATED_STATUS);
        return myOrder;
    }

    @BeforeEach
    public void initTest() {
        myOrder = createEntity(em);
    }

    @Test
    @Transactional
    public void createMyOrder() throws Exception {
        int databaseSizeBeforeCreate = myOrderRepository.findAll().size();

        // Create the MyOrder
        MyOrderDTO myOrderDTO = myOrderMapper.toDto(myOrder);
        restMyOrderMockMvc.perform(post("/api/my-orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(myOrderDTO)))
            .andExpect(status().isCreated());

        // Validate the MyOrder in the database
        List<MyOrder> myOrderList = myOrderRepository.findAll();
        assertThat(myOrderList).hasSize(databaseSizeBeforeCreate + 1);
        MyOrder testMyOrder = myOrderList.get(myOrderList.size() - 1);
        assertThat(testMyOrder.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testMyOrder.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testMyOrder.getRemark()).isEqualTo(DEFAULT_REMARK);
        assertThat(testMyOrder.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the MyOrder in Elasticsearch
        verify(mockMyOrderSearchRepository, times(1)).save(testMyOrder);
    }

    @Test
    @Transactional
    public void createMyOrderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = myOrderRepository.findAll().size();

        // Create the MyOrder with an existing ID
        myOrder.setId(1L);
        MyOrderDTO myOrderDTO = myOrderMapper.toDto(myOrder);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMyOrderMockMvc.perform(post("/api/my-orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(myOrderDTO)))
            .andExpect(status().isBadRequest());

        // Validate the MyOrder in the database
        List<MyOrder> myOrderList = myOrderRepository.findAll();
        assertThat(myOrderList).hasSize(databaseSizeBeforeCreate);

        // Validate the MyOrder in Elasticsearch
        verify(mockMyOrderSearchRepository, times(0)).save(myOrder);
    }


    @Test
    @Transactional
    public void getAllMyOrders() throws Exception {
        // Initialize the database
        myOrderRepository.saveAndFlush(myOrder);

        // Get all the myOrderList
        restMyOrderMockMvc.perform(get("/api/my-orders?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].remark").value(hasItem(DEFAULT_REMARK)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
    
    @Test
    @Transactional
    public void getMyOrder() throws Exception {
        // Initialize the database
        myOrderRepository.saveAndFlush(myOrder);

        // Get the myOrder
        restMyOrderMockMvc.perform(get("/api/my-orders/{id}", myOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(myOrder.getId().intValue()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.intValue()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()))
            .andExpect(jsonPath("$.remark").value(DEFAULT_REMARK))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMyOrder() throws Exception {
        // Get the myOrder
        restMyOrderMockMvc.perform(get("/api/my-orders/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMyOrder() throws Exception {
        // Initialize the database
        myOrderRepository.saveAndFlush(myOrder);

        int databaseSizeBeforeUpdate = myOrderRepository.findAll().size();

        // Update the myOrder
        MyOrder updatedMyOrder = myOrderRepository.findById(myOrder.getId()).get();
        // Disconnect from session so that the updates on updatedMyOrder are not directly saved in db
        em.detach(updatedMyOrder);
        updatedMyOrder
            .total(UPDATED_TOTAL)
            .currency(UPDATED_CURRENCY)
            .remark(UPDATED_REMARK)
            .status(UPDATED_STATUS);
        MyOrderDTO myOrderDTO = myOrderMapper.toDto(updatedMyOrder);

        restMyOrderMockMvc.perform(put("/api/my-orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(myOrderDTO)))
            .andExpect(status().isOk());

        // Validate the MyOrder in the database
        List<MyOrder> myOrderList = myOrderRepository.findAll();
        assertThat(myOrderList).hasSize(databaseSizeBeforeUpdate);
        MyOrder testMyOrder = myOrderList.get(myOrderList.size() - 1);
        assertThat(testMyOrder.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testMyOrder.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testMyOrder.getRemark()).isEqualTo(UPDATED_REMARK);
        assertThat(testMyOrder.getStatus()).isEqualTo(UPDATED_STATUS);

        // Validate the MyOrder in Elasticsearch
        verify(mockMyOrderSearchRepository, times(1)).save(testMyOrder);
    }

    @Test
    @Transactional
    public void updateNonExistingMyOrder() throws Exception {
        int databaseSizeBeforeUpdate = myOrderRepository.findAll().size();

        // Create the MyOrder
        MyOrderDTO myOrderDTO = myOrderMapper.toDto(myOrder);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMyOrderMockMvc.perform(put("/api/my-orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(myOrderDTO)))
            .andExpect(status().isBadRequest());

        // Validate the MyOrder in the database
        List<MyOrder> myOrderList = myOrderRepository.findAll();
        assertThat(myOrderList).hasSize(databaseSizeBeforeUpdate);

        // Validate the MyOrder in Elasticsearch
        verify(mockMyOrderSearchRepository, times(0)).save(myOrder);
    }

    @Test
    @Transactional
    public void deleteMyOrder() throws Exception {
        // Initialize the database
        myOrderRepository.saveAndFlush(myOrder);

        int databaseSizeBeforeDelete = myOrderRepository.findAll().size();

        // Delete the myOrder
        restMyOrderMockMvc.perform(delete("/api/my-orders/{id}", myOrder.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MyOrder> myOrderList = myOrderRepository.findAll();
        assertThat(myOrderList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the MyOrder in Elasticsearch
        verify(mockMyOrderSearchRepository, times(1)).deleteById(myOrder.getId());
    }

    @Test
    @Transactional
    public void searchMyOrder() throws Exception {
        // Initialize the database
        myOrderRepository.saveAndFlush(myOrder);
        when(mockMyOrderSearchRepository.search(queryStringQuery("id:" + myOrder.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(myOrder), PageRequest.of(0, 1), 1));
        // Search the myOrder
        restMyOrderMockMvc.perform(get("/api/_search/my-orders?query=id:" + myOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].remark").value(hasItem(DEFAULT_REMARK)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
}
