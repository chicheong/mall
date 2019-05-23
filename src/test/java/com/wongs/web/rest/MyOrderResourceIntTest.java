package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.MyOrder;
import com.wongs.repository.MyOrderRepository;
import com.wongs.repository.search.MyOrderSearchRepository;
import com.wongs.service.MyOrderService;
import com.wongs.service.dto.MyOrderDTO;
import com.wongs.service.mapper.MyOrderMapper;
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
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;


import static com.wongs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wongs.domain.enumeration.CurrencyType;
import com.wongs.domain.enumeration.OrderStatus;
/**
 * Test class for the MyOrderResource REST controller.
 *
 * @see MyOrderResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class MyOrderResourceIntTest {

    private static final String DEFAULT_RECEIVER = "AAAAAAAAAA";
    private static final String UPDATED_RECEIVER = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_TOTAL = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL = new BigDecimal(2);

    private static final CurrencyType DEFAULT_CURRENCY = CurrencyType.HKD;
    private static final CurrencyType UPDATED_CURRENCY = CurrencyType.CNY;

    private static final String DEFAULT_CONTACT_NUM = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT_NUM = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_REMARK = "AAAAAAAAAA";
    private static final String UPDATED_REMARK = "BBBBBBBBBB";

    private static final OrderStatus DEFAULT_STATUS = OrderStatus.PENDING;
    private static final OrderStatus UPDATED_STATUS = OrderStatus.COMFIRMED;

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
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restMyOrderMockMvc;

    private MyOrder myOrder;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MyOrderResource myOrderResource = new MyOrderResource(myOrderService);
        this.restMyOrderMockMvc = MockMvcBuilders.standaloneSetup(myOrderResource)
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
    public static MyOrder createEntity(EntityManager em) {
        MyOrder myOrder = new MyOrder()
            .receiver(DEFAULT_RECEIVER)
            .total(DEFAULT_TOTAL)
            .currency(DEFAULT_CURRENCY)
            .contactNum(DEFAULT_CONTACT_NUM)
            .email(DEFAULT_EMAIL)
            .remark(DEFAULT_REMARK)
            .status(DEFAULT_STATUS);
        return myOrder;
    }

    @Before
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
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myOrderDTO)))
            .andExpect(status().isCreated());

        // Validate the MyOrder in the database
        List<MyOrder> myOrderList = myOrderRepository.findAll();
        assertThat(myOrderList).hasSize(databaseSizeBeforeCreate + 1);
        MyOrder testMyOrder = myOrderList.get(myOrderList.size() - 1);
        assertThat(testMyOrder.getReceiver()).isEqualTo(DEFAULT_RECEIVER);
        assertThat(testMyOrder.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testMyOrder.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testMyOrder.getContactNum()).isEqualTo(DEFAULT_CONTACT_NUM);
        assertThat(testMyOrder.getEmail()).isEqualTo(DEFAULT_EMAIL);
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
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].receiver").value(hasItem(DEFAULT_RECEIVER.toString())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].contactNum").value(hasItem(DEFAULT_CONTACT_NUM.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())))
            .andExpect(jsonPath("$.[*].remark").value(hasItem(DEFAULT_REMARK.toString())))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(myOrder.getId().intValue()))
            .andExpect(jsonPath("$.receiver").value(DEFAULT_RECEIVER.toString()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.intValue()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()))
            .andExpect(jsonPath("$.contactNum").value(DEFAULT_CONTACT_NUM.toString()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL.toString()))
            .andExpect(jsonPath("$.remark").value(DEFAULT_REMARK.toString()))
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
            .receiver(UPDATED_RECEIVER)
            .total(UPDATED_TOTAL)
            .currency(UPDATED_CURRENCY)
            .contactNum(UPDATED_CONTACT_NUM)
            .email(UPDATED_EMAIL)
            .remark(UPDATED_REMARK)
            .status(UPDATED_STATUS);
        MyOrderDTO myOrderDTO = myOrderMapper.toDto(updatedMyOrder);

        restMyOrderMockMvc.perform(put("/api/my-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myOrderDTO)))
            .andExpect(status().isOk());

        // Validate the MyOrder in the database
        List<MyOrder> myOrderList = myOrderRepository.findAll();
        assertThat(myOrderList).hasSize(databaseSizeBeforeUpdate);
        MyOrder testMyOrder = myOrderList.get(myOrderList.size() - 1);
        assertThat(testMyOrder.getReceiver()).isEqualTo(UPDATED_RECEIVER);
        assertThat(testMyOrder.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testMyOrder.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testMyOrder.getContactNum()).isEqualTo(UPDATED_CONTACT_NUM);
        assertThat(testMyOrder.getEmail()).isEqualTo(UPDATED_EMAIL);
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
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].receiver").value(hasItem(DEFAULT_RECEIVER)))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].contactNum").value(hasItem(DEFAULT_CONTACT_NUM)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].remark").value(hasItem(DEFAULT_REMARK)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MyOrder.class);
        MyOrder myOrder1 = new MyOrder();
        myOrder1.setId(1L);
        MyOrder myOrder2 = new MyOrder();
        myOrder2.setId(myOrder1.getId());
        assertThat(myOrder1).isEqualTo(myOrder2);
        myOrder2.setId(2L);
        assertThat(myOrder1).isNotEqualTo(myOrder2);
        myOrder1.setId(null);
        assertThat(myOrder1).isNotEqualTo(myOrder2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(MyOrderDTO.class);
        MyOrderDTO myOrderDTO1 = new MyOrderDTO();
        myOrderDTO1.setId(1L);
        MyOrderDTO myOrderDTO2 = new MyOrderDTO();
        assertThat(myOrderDTO1).isNotEqualTo(myOrderDTO2);
        myOrderDTO2.setId(myOrderDTO1.getId());
        assertThat(myOrderDTO1).isEqualTo(myOrderDTO2);
        myOrderDTO2.setId(2L);
        assertThat(myOrderDTO1).isNotEqualTo(myOrderDTO2);
        myOrderDTO1.setId(null);
        assertThat(myOrderDTO1).isNotEqualTo(myOrderDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(myOrderMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(myOrderMapper.fromId(null)).isNull();
    }
}
