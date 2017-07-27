package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.MyAccount;
import com.wongs.repository.MyAccountRepository;
import com.wongs.repository.search.MyAccountSearchRepository;
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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.wongs.domain.enumeration.AccountType;
/**
 * Test class for the MyAccountResource REST controller.
 *
 * @see MyAccountResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class MyAccountResourceIntTest {

    private static final AccountType DEFAULT_TYPE = AccountType.PERSONAL;
    private static final AccountType UPDATED_TYPE = AccountType.COMPANY;

    @Autowired
    private MyAccountRepository myAccountRepository;

    @Autowired
    private MyAccountSearchRepository myAccountSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMyAccountMockMvc;

    private MyAccount myAccount;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        MyAccountResource myAccountResource = new MyAccountResource(myAccountRepository, myAccountSearchRepository);
        this.restMyAccountMockMvc = MockMvcBuilders.standaloneSetup(myAccountResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MyAccount createEntity(EntityManager em) {
        MyAccount myAccount = new MyAccount()
            .type(DEFAULT_TYPE);
        return myAccount;
    }

    @Before
    public void initTest() {
        myAccountSearchRepository.deleteAll();
        myAccount = createEntity(em);
    }

    @Test
    @Transactional
    public void createMyAccount() throws Exception {
        int databaseSizeBeforeCreate = myAccountRepository.findAll().size();

        // Create the MyAccount
        restMyAccountMockMvc.perform(post("/api/my-accounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myAccount)))
            .andExpect(status().isCreated());

        // Validate the MyAccount in the database
        List<MyAccount> myAccountList = myAccountRepository.findAll();
        assertThat(myAccountList).hasSize(databaseSizeBeforeCreate + 1);
        MyAccount testMyAccount = myAccountList.get(myAccountList.size() - 1);
        assertThat(testMyAccount.getType()).isEqualTo(DEFAULT_TYPE);

        // Validate the MyAccount in Elasticsearch
        MyAccount myAccountEs = myAccountSearchRepository.findOne(testMyAccount.getId());
        assertThat(myAccountEs).isEqualToComparingFieldByField(testMyAccount);
    }

    @Test
    @Transactional
    public void createMyAccountWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = myAccountRepository.findAll().size();

        // Create the MyAccount with an existing ID
        myAccount.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMyAccountMockMvc.perform(post("/api/my-accounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myAccount)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<MyAccount> myAccountList = myAccountRepository.findAll();
        assertThat(myAccountList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllMyAccounts() throws Exception {
        // Initialize the database
        myAccountRepository.saveAndFlush(myAccount);

        // Get all the myAccountList
        restMyAccountMockMvc.perform(get("/api/my-accounts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myAccount.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    public void getMyAccount() throws Exception {
        // Initialize the database
        myAccountRepository.saveAndFlush(myAccount);

        // Get the myAccount
        restMyAccountMockMvc.perform(get("/api/my-accounts/{id}", myAccount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(myAccount.getId().intValue()))
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
        myAccountSearchRepository.save(myAccount);
        int databaseSizeBeforeUpdate = myAccountRepository.findAll().size();

        // Update the myAccount
        MyAccount updatedMyAccount = myAccountRepository.findOne(myAccount.getId());
        updatedMyAccount
            .type(UPDATED_TYPE);

        restMyAccountMockMvc.perform(put("/api/my-accounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMyAccount)))
            .andExpect(status().isOk());

        // Validate the MyAccount in the database
        List<MyAccount> myAccountList = myAccountRepository.findAll();
        assertThat(myAccountList).hasSize(databaseSizeBeforeUpdate);
        MyAccount testMyAccount = myAccountList.get(myAccountList.size() - 1);
        assertThat(testMyAccount.getType()).isEqualTo(UPDATED_TYPE);

        // Validate the MyAccount in Elasticsearch
        MyAccount myAccountEs = myAccountSearchRepository.findOne(testMyAccount.getId());
        assertThat(myAccountEs).isEqualToComparingFieldByField(testMyAccount);
    }

    @Test
    @Transactional
    public void updateNonExistingMyAccount() throws Exception {
        int databaseSizeBeforeUpdate = myAccountRepository.findAll().size();

        // Create the MyAccount

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restMyAccountMockMvc.perform(put("/api/my-accounts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myAccount)))
            .andExpect(status().isCreated());

        // Validate the MyAccount in the database
        List<MyAccount> myAccountList = myAccountRepository.findAll();
        assertThat(myAccountList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteMyAccount() throws Exception {
        // Initialize the database
        myAccountRepository.saveAndFlush(myAccount);
        myAccountSearchRepository.save(myAccount);
        int databaseSizeBeforeDelete = myAccountRepository.findAll().size();

        // Get the myAccount
        restMyAccountMockMvc.perform(delete("/api/my-accounts/{id}", myAccount.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean myAccountExistsInEs = myAccountSearchRepository.exists(myAccount.getId());
        assertThat(myAccountExistsInEs).isFalse();

        // Validate the database is empty
        List<MyAccount> myAccountList = myAccountRepository.findAll();
        assertThat(myAccountList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchMyAccount() throws Exception {
        // Initialize the database
        myAccountRepository.saveAndFlush(myAccount);
        myAccountSearchRepository.save(myAccount);

        // Search the myAccount
        restMyAccountMockMvc.perform(get("/api/_search/my-accounts?query=id:" + myAccount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myAccount.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MyAccount.class);
        MyAccount myAccount1 = new MyAccount();
        myAccount1.setId(1L);
        MyAccount myAccount2 = new MyAccount();
        myAccount2.setId(myAccount1.getId());
        assertThat(myAccount1).isEqualTo(myAccount2);
        myAccount2.setId(2L);
        assertThat(myAccount1).isNotEqualTo(myAccount2);
        myAccount1.setId(null);
        assertThat(myAccount1).isNotEqualTo(myAccount2);
    }
}
