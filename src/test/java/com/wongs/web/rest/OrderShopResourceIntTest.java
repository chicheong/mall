package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.OrderShop;
import com.wongs.repository.OrderShopRepository;
import com.wongs.repository.search.OrderShopSearchRepository;
import com.wongs.service.dto.OrderShopDTO;
import com.wongs.service.mapper.OrderShopMapper;
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
/**
 * Test class for the OrderShopResource REST controller.
 *
 * @see OrderShopResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class OrderShopResourceIntTest {

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
    private OrderShopSearchRepository orderShopSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restOrderShopMockMvc;

    private OrderShop orderShop;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OrderShopResource orderShopResource = new OrderShopResource(orderShopRepository, orderShopMapper, orderShopSearchRepository);
        this.restOrderShopMockMvc = MockMvcBuilders.standaloneSetup(orderShopResource)
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
    public static OrderShop createEntity(EntityManager em) {
        OrderShop orderShop = new OrderShop()
            .total(DEFAULT_TOTAL)
            .currency(DEFAULT_CURRENCY)
            .remark(DEFAULT_REMARK);
        return orderShop;
    }

    @Before
    public void initTest() {
        orderShopSearchRepository.deleteAll();
        orderShop = createEntity(em);
    }

    @Test
    @Transactional
    public void createOrderShop() throws Exception {
        int databaseSizeBeforeCreate = orderShopRepository.findAll().size();

        // Create the OrderShop
        OrderShopDTO orderShopDTO = orderShopMapper.toDto(orderShop);
        restOrderShopMockMvc.perform(post("/api/order-shops")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
        OrderShop orderShopEs = orderShopSearchRepository.findOne(testOrderShop.getId());
        assertThat(orderShopEs).isEqualToIgnoringGivenFields(testOrderShop);
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
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderShopDTO)))
            .andExpect(status().isBadRequest());

        // Validate the OrderShop in the database
        List<OrderShop> orderShopList = orderShopRepository.findAll();
        assertThat(orderShopList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllOrderShops() throws Exception {
        // Initialize the database
        orderShopRepository.saveAndFlush(orderShop);

        // Get all the orderShopList
        restOrderShopMockMvc.perform(get("/api/order-shops?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderShop.getId().intValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].remark").value(hasItem(DEFAULT_REMARK.toString())));
    }

    @Test
    @Transactional
    public void getOrderShop() throws Exception {
        // Initialize the database
        orderShopRepository.saveAndFlush(orderShop);

        // Get the orderShop
        restOrderShopMockMvc.perform(get("/api/order-shops/{id}", orderShop.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(orderShop.getId().intValue()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.intValue()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()))
            .andExpect(jsonPath("$.remark").value(DEFAULT_REMARK.toString()));
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
        orderShopSearchRepository.save(orderShop);
        int databaseSizeBeforeUpdate = orderShopRepository.findAll().size();

        // Update the orderShop
        OrderShop updatedOrderShop = orderShopRepository.findOne(orderShop.getId());
        // Disconnect from session so that the updates on updatedOrderShop are not directly saved in db
        em.detach(updatedOrderShop);
        updatedOrderShop
            .total(UPDATED_TOTAL)
            .currency(UPDATED_CURRENCY)
            .remark(UPDATED_REMARK);
        OrderShopDTO orderShopDTO = orderShopMapper.toDto(updatedOrderShop);

        restOrderShopMockMvc.perform(put("/api/order-shops")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
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
        OrderShop orderShopEs = orderShopSearchRepository.findOne(testOrderShop.getId());
        assertThat(orderShopEs).isEqualToIgnoringGivenFields(testOrderShop);
    }

    @Test
    @Transactional
    public void updateNonExistingOrderShop() throws Exception {
        int databaseSizeBeforeUpdate = orderShopRepository.findAll().size();

        // Create the OrderShop
        OrderShopDTO orderShopDTO = orderShopMapper.toDto(orderShop);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restOrderShopMockMvc.perform(put("/api/order-shops")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderShopDTO)))
            .andExpect(status().isCreated());

        // Validate the OrderShop in the database
        List<OrderShop> orderShopList = orderShopRepository.findAll();
        assertThat(orderShopList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteOrderShop() throws Exception {
        // Initialize the database
        orderShopRepository.saveAndFlush(orderShop);
        orderShopSearchRepository.save(orderShop);
        int databaseSizeBeforeDelete = orderShopRepository.findAll().size();

        // Get the orderShop
        restOrderShopMockMvc.perform(delete("/api/order-shops/{id}", orderShop.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean orderShopExistsInEs = orderShopSearchRepository.exists(orderShop.getId());
        assertThat(orderShopExistsInEs).isFalse();

        // Validate the database is empty
        List<OrderShop> orderShopList = orderShopRepository.findAll();
        assertThat(orderShopList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchOrderShop() throws Exception {
        // Initialize the database
        orderShopRepository.saveAndFlush(orderShop);
        orderShopSearchRepository.save(orderShop);

        // Search the orderShop
        restOrderShopMockMvc.perform(get("/api/_search/order-shops?query=id:" + orderShop.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderShop.getId().intValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].remark").value(hasItem(DEFAULT_REMARK.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderShop.class);
        OrderShop orderShop1 = new OrderShop();
        orderShop1.setId(1L);
        OrderShop orderShop2 = new OrderShop();
        orderShop2.setId(orderShop1.getId());
        assertThat(orderShop1).isEqualTo(orderShop2);
        orderShop2.setId(2L);
        assertThat(orderShop1).isNotEqualTo(orderShop2);
        orderShop1.setId(null);
        assertThat(orderShop1).isNotEqualTo(orderShop2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderShopDTO.class);
        OrderShopDTO orderShopDTO1 = new OrderShopDTO();
        orderShopDTO1.setId(1L);
        OrderShopDTO orderShopDTO2 = new OrderShopDTO();
        assertThat(orderShopDTO1).isNotEqualTo(orderShopDTO2);
        orderShopDTO2.setId(orderShopDTO1.getId());
        assertThat(orderShopDTO1).isEqualTo(orderShopDTO2);
        orderShopDTO2.setId(2L);
        assertThat(orderShopDTO1).isNotEqualTo(orderShopDTO2);
        orderShopDTO1.setId(null);
        assertThat(orderShopDTO1).isNotEqualTo(orderShopDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(orderShopMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(orderShopMapper.fromId(null)).isNull();
    }
}
