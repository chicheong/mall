package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.MyOrder;
import com.wongs.repository.MyOrderRepository;
import com.wongs.service.MyOrderService;
import com.wongs.repository.search.MyOrderSearchRepository;
import com.wongs.service.dto.MyOrderDTO;
import com.wongs.service.mapper.MyOrderMapper;
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
import java.math.BigDecimal;
import java.util.List;

import static com.wongs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
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

    private static final BigDecimal DEFAULT_TOTAL = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL = new BigDecimal(2);

    private static final CurrencyType DEFAULT_CURRENCY = CurrencyType.HKD;
    private static final CurrencyType UPDATED_CURRENCY = CurrencyType.CNY;

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

    @Autowired
    private MyOrderSearchRepository myOrderSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

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
            .setMessageConverters(jacksonMessageConverter).build();
    }

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

    @Before
    public void initTest() {
        myOrderSearchRepository.deleteAll();
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
        assertThat(testMyOrder.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testMyOrder.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testMyOrder.getRemark()).isEqualTo(DEFAULT_REMARK);
        assertThat(testMyOrder.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the MyOrder in Elasticsearch
        MyOrder myOrderEs = myOrderSearchRepository.findOne(testMyOrder.getId());
        assertThat(myOrderEs).isEqualToIgnoringGivenFields(testMyOrder);
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
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
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
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.intValue()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()))
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
        myOrderSearchRepository.save(myOrder);
        int databaseSizeBeforeUpdate = myOrderRepository.findAll().size();

        // Update the myOrder
        MyOrder updatedMyOrder = myOrderRepository.findOne(myOrder.getId());
        // Disconnect from session so that the updates on updatedMyOrder are not directly saved in db
        em.detach(updatedMyOrder);
        updatedMyOrder
            .total(UPDATED_TOTAL)
            .currency(UPDATED_CURRENCY)
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
        assertThat(testMyOrder.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testMyOrder.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testMyOrder.getRemark()).isEqualTo(UPDATED_REMARK);
        assertThat(testMyOrder.getStatus()).isEqualTo(UPDATED_STATUS);

        // Validate the MyOrder in Elasticsearch
        MyOrder myOrderEs = myOrderSearchRepository.findOne(testMyOrder.getId());
        assertThat(myOrderEs).isEqualToIgnoringGivenFields(testMyOrder);
    }

    @Test
    @Transactional
    public void updateNonExistingMyOrder() throws Exception {
        int databaseSizeBeforeUpdate = myOrderRepository.findAll().size();

        // Create the MyOrder
        MyOrderDTO myOrderDTO = myOrderMapper.toDto(myOrder);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restMyOrderMockMvc.perform(put("/api/my-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myOrderDTO)))
            .andExpect(status().isCreated());

        // Validate the MyOrder in the database
        List<MyOrder> myOrderList = myOrderRepository.findAll();
        assertThat(myOrderList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteMyOrder() throws Exception {
        // Initialize the database
        myOrderRepository.saveAndFlush(myOrder);
        myOrderSearchRepository.save(myOrder);
        int databaseSizeBeforeDelete = myOrderRepository.findAll().size();

        // Get the myOrder
        restMyOrderMockMvc.perform(delete("/api/my-orders/{id}", myOrder.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean myOrderExistsInEs = myOrderSearchRepository.exists(myOrder.getId());
        assertThat(myOrderExistsInEs).isFalse();

        // Validate the database is empty
        List<MyOrder> myOrderList = myOrderRepository.findAll();
        assertThat(myOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchMyOrder() throws Exception {
        // Initialize the database
        myOrderRepository.saveAndFlush(myOrder);
        myOrderSearchRepository.save(myOrder);

        // Search the myOrder
        restMyOrderMockMvc.perform(get("/api/_search/my-orders?query=id:" + myOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].remark").value(hasItem(DEFAULT_REMARK.toString())))
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
