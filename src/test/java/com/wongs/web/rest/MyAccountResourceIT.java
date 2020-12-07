package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.MyAccount;
import com.wongs.repository.MyAccountRepository;
import com.wongs.repository.search.MyAccountSearchRepository;
import com.wongs.service.MyAccountService;
import com.wongs.service.dto.MyAccountDTO;
import com.wongs.service.mapper.MyAccountMapper;

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
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wongs.domain.enumeration.AccountType;
/**
 * Integration tests for the {@link MyAccountResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class MyAccountResourceIT {

    private static final BigDecimal DEFAULT_BALANCE = new BigDecimal(1);
    private static final BigDecimal UPDATED_BALANCE = new BigDecimal(2);

    private static final AccountType DEFAULT_TYPE = AccountType.PERSONAL;
    private static final AccountType UPDATED_TYPE = AccountType.COMPANY;

    @Autowired
    private MyAccountRepository myAccountRepository;

    @Mock
    private MyAccountRepository myAccountRepositoryMock;

    @Autowired
    private MyAccountMapper myAccountMapper;

    @Mock
    private MyAccountService myAccountServiceMock;

    @Autowired
    private MyAccountService myAccountService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.MyAccountSearchRepositoryMockConfiguration
     */
    @Autowired
    private MyAccountSearchRepository mockMyAccountSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMyAccountMockMvc;

    private MyAccount myAccount;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MyAccount createEntity(EntityManager em) {
        MyAccount myAccount = new MyAccount()
            .balance(DEFAULT_BALANCE)
            .type(DEFAULT_TYPE);
        return myAccount;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MyAccount createUpdatedEntity(EntityManager em) {
        MyAccount myAccount = new MyAccount()
            .balance(UPDATED_BALANCE)
            .type(UPDATED_TYPE);
        return myAccount;
    }

    @BeforeEach
    public void initTest() {
        myAccount = createEntity(em);
    }

    @Test
    @Transactional
    public void createMyAccount() throws Exception {
        int databaseSizeBeforeCreate = myAccountRepository.findAll().size();

        // Create the MyAccount
        MyAccountDTO myAccountDTO = myAccountMapper.toDto(myAccount);
        restMyAccountMockMvc.perform(post("/api/my-accounts")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(myAccountDTO)))
            .andExpect(status().isCreated());

        // Validate the MyAccount in the database
        List<MyAccount> myAccountList = myAccountRepository.findAll();
        assertThat(myAccountList).hasSize(databaseSizeBeforeCreate + 1);
        MyAccount testMyAccount = myAccountList.get(myAccountList.size() - 1);
        assertThat(testMyAccount.getBalance()).isEqualTo(DEFAULT_BALANCE);
        assertThat(testMyAccount.getType()).isEqualTo(DEFAULT_TYPE);

        // Validate the MyAccount in Elasticsearch
        verify(mockMyAccountSearchRepository, times(1)).save(testMyAccount);
    }

    @Test
    @Transactional
    public void createMyAccountWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = myAccountRepository.findAll().size();

        // Create the MyAccount with an existing ID
        myAccount.setId(1L);
        MyAccountDTO myAccountDTO = myAccountMapper.toDto(myAccount);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMyAccountMockMvc.perform(post("/api/my-accounts")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(myAccountDTO)))
            .andExpect(status().isBadRequest());

        // Validate the MyAccount in the database
        List<MyAccount> myAccountList = myAccountRepository.findAll();
        assertThat(myAccountList).hasSize(databaseSizeBeforeCreate);

        // Validate the MyAccount in Elasticsearch
        verify(mockMyAccountSearchRepository, times(0)).save(myAccount);
    }


    @Test
    @Transactional
    public void getAllMyAccounts() throws Exception {
        // Initialize the database
        myAccountRepository.saveAndFlush(myAccount);

        // Get all the myAccountList
        restMyAccountMockMvc.perform(get("/api/my-accounts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myAccount.getId().intValue())))
            .andExpect(jsonPath("$.[*].balance").value(hasItem(DEFAULT_BALANCE.intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllMyAccountsWithEagerRelationshipsIsEnabled() throws Exception {
        when(myAccountServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMyAccountMockMvc.perform(get("/api/my-accounts?eagerload=true"))
            .andExpect(status().isOk());

        verify(myAccountServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllMyAccountsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(myAccountServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMyAccountMockMvc.perform(get("/api/my-accounts?eagerload=true"))
            .andExpect(status().isOk());

        verify(myAccountServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getMyAccount() throws Exception {
        // Initialize the database
        myAccountRepository.saveAndFlush(myAccount);

        // Get the myAccount
        restMyAccountMockMvc.perform(get("/api/my-accounts/{id}", myAccount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(myAccount.getId().intValue()))
            .andExpect(jsonPath("$.balance").value(DEFAULT_BALANCE.intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMyAccount() throws Exception {
        // Get the myAccount
        restMyAccountMockMvc.perform(get("/api/my-accounts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMyAccount() throws Exception {
        // Initialize the database
        myAccountRepository.saveAndFlush(myAccount);

        int databaseSizeBeforeUpdate = myAccountRepository.findAll().size();

        // Update the myAccount
        MyAccount updatedMyAccount = myAccountRepository.findById(myAccount.getId()).get();
        // Disconnect from session so that the updates on updatedMyAccount are not directly saved in db
        em.detach(updatedMyAccount);
        updatedMyAccount
            .balance(UPDATED_BALANCE)
            .type(UPDATED_TYPE);
        MyAccountDTO myAccountDTO = myAccountMapper.toDto(updatedMyAccount);

        restMyAccountMockMvc.perform(put("/api/my-accounts")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(myAccountDTO)))
            .andExpect(status().isOk());

        // Validate the MyAccount in the database
        List<MyAccount> myAccountList = myAccountRepository.findAll();
        assertThat(myAccountList).hasSize(databaseSizeBeforeUpdate);
        MyAccount testMyAccount = myAccountList.get(myAccountList.size() - 1);
        assertThat(testMyAccount.getBalance()).isEqualTo(UPDATED_BALANCE);
        assertThat(testMyAccount.getType()).isEqualTo(UPDATED_TYPE);

        // Validate the MyAccount in Elasticsearch
        verify(mockMyAccountSearchRepository, times(1)).save(testMyAccount);
    }

    @Test
    @Transactional
    public void updateNonExistingMyAccount() throws Exception {
        int databaseSizeBeforeUpdate = myAccountRepository.findAll().size();

        // Create the MyAccount
        MyAccountDTO myAccountDTO = myAccountMapper.toDto(myAccount);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMyAccountMockMvc.perform(put("/api/my-accounts")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(myAccountDTO)))
            .andExpect(status().isBadRequest());

        // Validate the MyAccount in the database
        List<MyAccount> myAccountList = myAccountRepository.findAll();
        assertThat(myAccountList).hasSize(databaseSizeBeforeUpdate);

        // Validate the MyAccount in Elasticsearch
        verify(mockMyAccountSearchRepository, times(0)).save(myAccount);
    }

    @Test
    @Transactional
    public void deleteMyAccount() throws Exception {
        // Initialize the database
        myAccountRepository.saveAndFlush(myAccount);

        int databaseSizeBeforeDelete = myAccountRepository.findAll().size();

        // Delete the myAccount
        restMyAccountMockMvc.perform(delete("/api/my-accounts/{id}", myAccount.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MyAccount> myAccountList = myAccountRepository.findAll();
        assertThat(myAccountList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the MyAccount in Elasticsearch
        verify(mockMyAccountSearchRepository, times(1)).deleteById(myAccount.getId());
    }

    @Test
    @Transactional
    public void searchMyAccount() throws Exception {
        // Initialize the database
        myAccountRepository.saveAndFlush(myAccount);
        when(mockMyAccountSearchRepository.search(queryStringQuery("id:" + myAccount.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(myAccount), PageRequest.of(0, 1), 1));
        // Search the myAccount
        restMyAccountMockMvc.perform(get("/api/_search/my-accounts?query=id:" + myAccount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myAccount.getId().intValue())))
            .andExpect(jsonPath("$.[*].balance").value(hasItem(DEFAULT_BALANCE.intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }
}
