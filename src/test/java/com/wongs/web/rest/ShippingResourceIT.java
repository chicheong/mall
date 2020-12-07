package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.Shipping;
import com.wongs.repository.ShippingRepository;
import com.wongs.repository.search.ShippingSearchRepository;
import com.wongs.service.ShippingService;
import com.wongs.service.dto.ShippingDTO;
import com.wongs.service.mapper.ShippingMapper;

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

import com.wongs.domain.enumeration.CurrencyType;
import com.wongs.domain.enumeration.ShippingStatus;
/**
 * Integration tests for the {@link ShippingResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class ShippingResourceIT {

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

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.ShippingSearchRepositoryMockConfiguration
     */
    @Autowired
    private ShippingSearchRepository mockShippingSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShippingMockMvc;

    private Shipping shipping;

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
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Shipping createUpdatedEntity(EntityManager em) {
        Shipping shipping = new Shipping()
            .price(UPDATED_PRICE)
            .currency(UPDATED_CURRENCY)
            .date(UPDATED_DATE)
            .status(UPDATED_STATUS);
        return shipping;
    }

    @BeforeEach
    public void initTest() {
        shipping = createEntity(em);
    }

    @Test
    @Transactional
    public void createShipping() throws Exception {
        int databaseSizeBeforeCreate = shippingRepository.findAll().size();

        // Create the Shipping
        ShippingDTO shippingDTO = shippingMapper.toDto(shipping);
        restShippingMockMvc.perform(post("/api/shippings")
            .contentType(MediaType.APPLICATION_JSON)
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
        verify(mockShippingSearchRepository, times(1)).save(testShipping);
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
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shippingDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Shipping in the database
        List<Shipping> shippingList = shippingRepository.findAll();
        assertThat(shippingList).hasSize(databaseSizeBeforeCreate);

        // Validate the Shipping in Elasticsearch
        verify(mockShippingSearchRepository, times(0)).save(shipping);
    }


    @Test
    @Transactional
    public void getAllShippings() throws Exception {
        // Initialize the database
        shippingRepository.saveAndFlush(shipping);

        // Get all the shippingList
        restShippingMockMvc.perform(get("/api/shippings?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
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

        int databaseSizeBeforeUpdate = shippingRepository.findAll().size();

        // Update the shipping
        Shipping updatedShipping = shippingRepository.findById(shipping.getId()).get();
        // Disconnect from session so that the updates on updatedShipping are not directly saved in db
        em.detach(updatedShipping);
        updatedShipping
            .price(UPDATED_PRICE)
            .currency(UPDATED_CURRENCY)
            .date(UPDATED_DATE)
            .status(UPDATED_STATUS);
        ShippingDTO shippingDTO = shippingMapper.toDto(updatedShipping);

        restShippingMockMvc.perform(put("/api/shippings")
            .contentType(MediaType.APPLICATION_JSON)
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
        verify(mockShippingSearchRepository, times(1)).save(testShipping);
    }

    @Test
    @Transactional
    public void updateNonExistingShipping() throws Exception {
        int databaseSizeBeforeUpdate = shippingRepository.findAll().size();

        // Create the Shipping
        ShippingDTO shippingDTO = shippingMapper.toDto(shipping);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShippingMockMvc.perform(put("/api/shippings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shippingDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Shipping in the database
        List<Shipping> shippingList = shippingRepository.findAll();
        assertThat(shippingList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Shipping in Elasticsearch
        verify(mockShippingSearchRepository, times(0)).save(shipping);
    }

    @Test
    @Transactional
    public void deleteShipping() throws Exception {
        // Initialize the database
        shippingRepository.saveAndFlush(shipping);

        int databaseSizeBeforeDelete = shippingRepository.findAll().size();

        // Delete the shipping
        restShippingMockMvc.perform(delete("/api/shippings/{id}", shipping.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Shipping> shippingList = shippingRepository.findAll();
        assertThat(shippingList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Shipping in Elasticsearch
        verify(mockShippingSearchRepository, times(1)).deleteById(shipping.getId());
    }

    @Test
    @Transactional
    public void searchShipping() throws Exception {
        // Initialize the database
        shippingRepository.saveAndFlush(shipping);
        when(mockShippingSearchRepository.search(queryStringQuery("id:" + shipping.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(shipping), PageRequest.of(0, 1), 1));
        // Search the shipping
        restShippingMockMvc.perform(get("/api/_search/shippings?query=id:" + shipping.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shipping.getId().intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
}
