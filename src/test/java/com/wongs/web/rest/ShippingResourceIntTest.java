package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.Shipping;
import com.wongs.repository.ShippingRepository;
import com.wongs.service.ShippingService;
import com.wongs.repository.search.ShippingSearchRepository;
import com.wongs.service.dto.ShippingDTO;
import com.wongs.service.mapper.ShippingMapper;
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

import com.wongs.domain.enumeration.CurrencyType;
import com.wongs.domain.enumeration.ShippingStatus;
/**
 * Test class for the ShippingResource REST controller.
 *
 * @see ShippingResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class ShippingResourceIntTest {

    private static final BigDecimal DEFAULT_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICE = new BigDecimal(2);

    private static final CurrencyType DEFAULT_CURRENCY = CurrencyType.HKD;
    private static final CurrencyType UPDATED_CURRENCY = CurrencyType.CNY;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ShippingStatus DEFAULT_STATUS = ShippingStatus.PENDING;
    private static final ShippingStatus UPDATED_STATUS = ShippingStatus.SHIPPED;

    @Autowired
    private ShippingRepository shippingRepository;

    @Autowired
    private ShippingMapper shippingMapper;

    @Autowired
    private ShippingService shippingService;

    @Autowired
    private ShippingSearchRepository shippingSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restShippingMockMvc;

    private Shipping shipping;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ShippingResource shippingResource = new ShippingResource(shippingService);
        this.restShippingMockMvc = MockMvcBuilders.standaloneSetup(shippingResource)
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
    public static Shipping createEntity(EntityManager em) {
        Shipping shipping = new Shipping()
            .price(DEFAULT_PRICE)
            .currency(DEFAULT_CURRENCY)
            .date(DEFAULT_DATE)
            .status(DEFAULT_STATUS);
        return shipping;
    }

    @Before
    public void initTest() {
        shippingSearchRepository.deleteAll();
        shipping = createEntity(em);
    }

    @Test
    @Transactional
    public void createShipping() throws Exception {
        int databaseSizeBeforeCreate = shippingRepository.findAll().size();

        // Create the Shipping
        ShippingDTO shippingDTO = shippingMapper.toDto(shipping);
        restShippingMockMvc.perform(post("/api/shippings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shippingDTO)))
            .andExpect(status().isCreated());

        // Validate the Shipping in the database
        List<Shipping> shippingList = shippingRepository.findAll();
        assertThat(shippingList).hasSize(databaseSizeBeforeCreate + 1);
        Shipping testShipping = shippingList.get(shippingList.size() - 1);
        assertThat(testShipping.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testShipping.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testShipping.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testShipping.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the Shipping in Elasticsearch
        Shipping shippingEs = shippingSearchRepository.findOne(testShipping.getId());
        assertThat(testShipping.getDate()).isEqualTo(testShipping.getDate());
        assertThat(shippingEs).isEqualToIgnoringGivenFields(testShipping, "date");
    }

    @Test
    @Transactional
    public void createShippingWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = shippingRepository.findAll().size();

        // Create the Shipping with an existing ID
        shipping.setId(1L);
        ShippingDTO shippingDTO = shippingMapper.toDto(shipping);

        // An entity with an existing ID cannot be created, so this API call must fail
        restShippingMockMvc.perform(post("/api/shippings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shippingDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Shipping in the database
        List<Shipping> shippingList = shippingRepository.findAll();
        assertThat(shippingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllShippings() throws Exception {
        // Initialize the database
        shippingRepository.saveAndFlush(shipping);

        // Get all the shippingList
        restShippingMockMvc.perform(get("/api/shippings?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shipping.getId().intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    public void getShipping() throws Exception {
        // Initialize the database
        shippingRepository.saveAndFlush(shipping);

        // Get the shipping
        restShippingMockMvc.perform(get("/api/shippings/{id}", shipping.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(shipping.getId().intValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.intValue()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingShipping() throws Exception {
        // Get the shipping
        restShippingMockMvc.perform(get("/api/shippings/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateShipping() throws Exception {
        // Initialize the database
        shippingRepository.saveAndFlush(shipping);
        shippingSearchRepository.save(shipping);
        int databaseSizeBeforeUpdate = shippingRepository.findAll().size();

        // Update the shipping
        Shipping updatedShipping = shippingRepository.findOne(shipping.getId());
        // Disconnect from session so that the updates on updatedShipping are not directly saved in db
        em.detach(updatedShipping);
        updatedShipping
            .price(UPDATED_PRICE)
            .currency(UPDATED_CURRENCY)
            .date(UPDATED_DATE)
            .status(UPDATED_STATUS);
        ShippingDTO shippingDTO = shippingMapper.toDto(updatedShipping);

        restShippingMockMvc.perform(put("/api/shippings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shippingDTO)))
            .andExpect(status().isOk());

        // Validate the Shipping in the database
        List<Shipping> shippingList = shippingRepository.findAll();
        assertThat(shippingList).hasSize(databaseSizeBeforeUpdate);
        Shipping testShipping = shippingList.get(shippingList.size() - 1);
        assertThat(testShipping.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testShipping.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testShipping.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testShipping.getStatus()).isEqualTo(UPDATED_STATUS);

        // Validate the Shipping in Elasticsearch
        Shipping shippingEs = shippingSearchRepository.findOne(testShipping.getId());
        assertThat(testShipping.getDate()).isEqualTo(testShipping.getDate());
        assertThat(shippingEs).isEqualToIgnoringGivenFields(testShipping, "date");
    }

    @Test
    @Transactional
    public void updateNonExistingShipping() throws Exception {
        int databaseSizeBeforeUpdate = shippingRepository.findAll().size();

        // Create the Shipping
        ShippingDTO shippingDTO = shippingMapper.toDto(shipping);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restShippingMockMvc.perform(put("/api/shippings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shippingDTO)))
            .andExpect(status().isCreated());

        // Validate the Shipping in the database
        List<Shipping> shippingList = shippingRepository.findAll();
        assertThat(shippingList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteShipping() throws Exception {
        // Initialize the database
        shippingRepository.saveAndFlush(shipping);
        shippingSearchRepository.save(shipping);
        int databaseSizeBeforeDelete = shippingRepository.findAll().size();

        // Get the shipping
        restShippingMockMvc.perform(delete("/api/shippings/{id}", shipping.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean shippingExistsInEs = shippingSearchRepository.exists(shipping.getId());
        assertThat(shippingExistsInEs).isFalse();

        // Validate the database is empty
        List<Shipping> shippingList = shippingRepository.findAll();
        assertThat(shippingList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchShipping() throws Exception {
        // Initialize the database
        shippingRepository.saveAndFlush(shipping);
        shippingSearchRepository.save(shipping);

        // Search the shipping
        restShippingMockMvc.perform(get("/api/_search/shippings?query=id:" + shipping.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shipping.getId().intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Shipping.class);
        Shipping shipping1 = new Shipping();
        shipping1.setId(1L);
        Shipping shipping2 = new Shipping();
        shipping2.setId(shipping1.getId());
        assertThat(shipping1).isEqualTo(shipping2);
        shipping2.setId(2L);
        assertThat(shipping1).isNotEqualTo(shipping2);
        shipping1.setId(null);
        assertThat(shipping1).isNotEqualTo(shipping2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShippingDTO.class);
        ShippingDTO shippingDTO1 = new ShippingDTO();
        shippingDTO1.setId(1L);
        ShippingDTO shippingDTO2 = new ShippingDTO();
        assertThat(shippingDTO1).isNotEqualTo(shippingDTO2);
        shippingDTO2.setId(shippingDTO1.getId());
        assertThat(shippingDTO1).isEqualTo(shippingDTO2);
        shippingDTO2.setId(2L);
        assertThat(shippingDTO1).isNotEqualTo(shippingDTO2);
        shippingDTO1.setId(null);
        assertThat(shippingDTO1).isNotEqualTo(shippingDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(shippingMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(shippingMapper.fromId(null)).isNull();
    }
}
