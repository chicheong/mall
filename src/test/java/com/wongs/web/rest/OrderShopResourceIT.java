package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.OrderShop;
import com.wongs.repository.OrderShopRepository;
import com.wongs.repository.search.OrderShopSearchRepository;
import com.wongs.service.OrderShopService;
import com.wongs.service.dto.OrderShopDTO;
import com.wongs.service.mapper.OrderShopMapper;

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
/**
 * Integration tests for the {@link OrderShopResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class OrderShopResourceIT {

    private static final BigDecimal DEFAULT_TOTAL = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL = new BigDecimal(2);

    private static final CurrencyType DEFAULT_CURRENCY = CurrencyType.HKD;
    private static final CurrencyType UPDATED_CURRENCY = CurrencyType.CNY;

    private static final String DEFAULT_REMARK = "AAAAAAAAAA";
    private static final String UPDATED_REMARK = "BBBBBBBBBB";

    @Autowired
    private OrderShopRepository orderShopRepository;

    @Autowired
    private OrderShopMapper orderShopMapper;

    @Autowired
    private OrderShopService orderShopService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.OrderShopSearchRepositoryMockConfiguration
     */
    @Autowired
    private OrderShopSearchRepository mockOrderShopSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrderShopMockMvc;

    private OrderShop orderShop;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderShop createEntity(EntityManager em) {
        OrderShop orderShop = new OrderShop()
            .total(DEFAULT_TOTAL)
            .currency(DEFAULT_CURRENCY)
            .remark(DEFAULT_REMARK);
        return orderShop;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderShop createUpdatedEntity(EntityManager em) {
        OrderShop orderShop = new OrderShop()
            .total(UPDATED_TOTAL)
            .currency(UPDATED_CURRENCY)
            .remark(UPDATED_REMARK);
        return orderShop;
    }

    @BeforeEach
    public void initTest() {
        orderShop = createEntity(em);
    }

    @Test
    @Transactional
    public void createOrderShop() throws Exception {
        int databaseSizeBeforeCreate = orderShopRepository.findAll().size();

        // Create the OrderShop
        OrderShopDTO orderShopDTO = orderShopMapper.toDto(orderShop);
        restOrderShopMockMvc.perform(post("/api/order-shops")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(orderShopDTO)))
            .andExpect(status().isCreated());

        // Validate the OrderShop in the database
        List<OrderShop> orderShopList = orderShopRepository.findAll();
        assertThat(orderShopList).hasSize(databaseSizeBeforeCreate + 1);
        OrderShop testOrderShop = orderShopList.get(orderShopList.size() - 1);
        assertThat(testOrderShop.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testOrderShop.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testOrderShop.getRemark()).isEqualTo(DEFAULT_REMARK);

        // Validate the OrderShop in Elasticsearch
        verify(mockOrderShopSearchRepository, times(1)).save(testOrderShop);
    }

    @Test
    @Transactional
    public void createOrderShopWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = orderShopRepository.findAll().size();

        // Create the OrderShop with an existing ID
        orderShop.setId(1L);
        OrderShopDTO orderShopDTO = orderShopMapper.toDto(orderShop);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderShopMockMvc.perform(post("/api/order-shops")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(orderShopDTO)))
            .andExpect(status().isBadRequest());

        // Validate the OrderShop in the database
        List<OrderShop> orderShopList = orderShopRepository.findAll();
        assertThat(orderShopList).hasSize(databaseSizeBeforeCreate);

        // Validate the OrderShop in Elasticsearch
        verify(mockOrderShopSearchRepository, times(0)).save(orderShop);
    }


    @Test
    @Transactional
    public void getAllOrderShops() throws Exception {
        // Initialize the database
        orderShopRepository.saveAndFlush(orderShop);

        // Get all the orderShopList
        restOrderShopMockMvc.perform(get("/api/order-shops?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderShop.getId().intValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].remark").value(hasItem(DEFAULT_REMARK)));
    }
    
    @Test
    @Transactional
    public void getOrderShop() throws Exception {
        // Initialize the database
        orderShopRepository.saveAndFlush(orderShop);

        // Get the orderShop
        restOrderShopMockMvc.perform(get("/api/order-shops/{id}", orderShop.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(orderShop.getId().intValue()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.intValue()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()))
            .andExpect(jsonPath("$.remark").value(DEFAULT_REMARK));
    }

    @Test
    @Transactional
    public void getNonExistingOrderShop() throws Exception {
        // Get the orderShop
        restOrderShopMockMvc.perform(get("/api/order-shops/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOrderShop() throws Exception {
        // Initialize the database
        orderShopRepository.saveAndFlush(orderShop);

        int databaseSizeBeforeUpdate = orderShopRepository.findAll().size();

        // Update the orderShop
        OrderShop updatedOrderShop = orderShopRepository.findById(orderShop.getId()).get();
        // Disconnect from session so that the updates on updatedOrderShop are not directly saved in db
        em.detach(updatedOrderShop);
        updatedOrderShop
            .total(UPDATED_TOTAL)
            .currency(UPDATED_CURRENCY)
            .remark(UPDATED_REMARK);
        OrderShopDTO orderShopDTO = orderShopMapper.toDto(updatedOrderShop);

        restOrderShopMockMvc.perform(put("/api/order-shops")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(orderShopDTO)))
            .andExpect(status().isOk());

        // Validate the OrderShop in the database
        List<OrderShop> orderShopList = orderShopRepository.findAll();
        assertThat(orderShopList).hasSize(databaseSizeBeforeUpdate);
        OrderShop testOrderShop = orderShopList.get(orderShopList.size() - 1);
        assertThat(testOrderShop.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testOrderShop.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testOrderShop.getRemark()).isEqualTo(UPDATED_REMARK);

        // Validate the OrderShop in Elasticsearch
        verify(mockOrderShopSearchRepository, times(1)).save(testOrderShop);
    }

    @Test
    @Transactional
    public void updateNonExistingOrderShop() throws Exception {
        int databaseSizeBeforeUpdate = orderShopRepository.findAll().size();

        // Create the OrderShop
        OrderShopDTO orderShopDTO = orderShopMapper.toDto(orderShop);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderShopMockMvc.perform(put("/api/order-shops")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(orderShopDTO)))
            .andExpect(status().isBadRequest());

        // Validate the OrderShop in the database
        List<OrderShop> orderShopList = orderShopRepository.findAll();
        assertThat(orderShopList).hasSize(databaseSizeBeforeUpdate);

        // Validate the OrderShop in Elasticsearch
        verify(mockOrderShopSearchRepository, times(0)).save(orderShop);
    }

    @Test
    @Transactional
    public void deleteOrderShop() throws Exception {
        // Initialize the database
        orderShopRepository.saveAndFlush(orderShop);

        int databaseSizeBeforeDelete = orderShopRepository.findAll().size();

        // Delete the orderShop
        restOrderShopMockMvc.perform(delete("/api/order-shops/{id}", orderShop.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrderShop> orderShopList = orderShopRepository.findAll();
        assertThat(orderShopList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the OrderShop in Elasticsearch
        verify(mockOrderShopSearchRepository, times(1)).deleteById(orderShop.getId());
    }

    @Test
    @Transactional
    public void searchOrderShop() throws Exception {
        // Initialize the database
        orderShopRepository.saveAndFlush(orderShop);
        when(mockOrderShopSearchRepository.search(queryStringQuery("id:" + orderShop.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(orderShop), PageRequest.of(0, 1), 1));
        // Search the orderShop
        restOrderShopMockMvc.perform(get("/api/_search/order-shops?query=id:" + orderShop.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderShop.getId().intValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].remark").value(hasItem(DEFAULT_REMARK)));
    }
}
