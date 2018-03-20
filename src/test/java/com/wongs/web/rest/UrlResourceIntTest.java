package com.wongs.web.rest;

import com.wongs.MallApp;

import com.wongs.domain.Url;
import com.wongs.repository.UrlRepository;
import com.wongs.service.UrlService;
import com.wongs.repository.search.UrlSearchRepository;
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

import com.wongs.domain.enumeration.EntityType;
/**
 * Test class for the UrlResource REST controller.
 *
 * @see UrlResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MallApp.class)
public class UrlResourceIntTest {

    private static final EntityType DEFAULT_ENTITY_TYPE = EntityType.PRODUCT;
    private static final EntityType UPDATED_ENTITY_TYPE = EntityType.PRODUCTITEM;

    private static final Integer DEFAULT_ENTITY_ID = 1;
    private static final Integer UPDATED_ENTITY_ID = 2;

    private static final String DEFAULT_PATH = "AAAAAAAAAA";
    private static final String UPDATED_PATH = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_LAST_MODIFIED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST_MODIFIED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private UrlService urlService;

    @Autowired
    private UrlSearchRepository urlSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restUrlMockMvc;

    private Url url;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UrlResource urlResource = new UrlResource(urlService);
        this.restUrlMockMvc = MockMvcBuilders.standaloneSetup(urlResource)
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
    public static Url createEntity(EntityManager em) {
        Url url = new Url()
            .entityType(DEFAULT_ENTITY_TYPE)
            .entityId(DEFAULT_ENTITY_ID)
            .path(DEFAULT_PATH)
            .description(DEFAULT_DESCRIPTION)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY)
            .lastModifiedDate(DEFAULT_LAST_MODIFIED_DATE);
        return url;
    }

    @Before
    public void initTest() {
        urlSearchRepository.deleteAll();
        url = createEntity(em);
    }

    @Test
    @Transactional
    public void createUrl() throws Exception {
        int databaseSizeBeforeCreate = urlRepository.findAll().size();

        // Create the Url
        restUrlMockMvc.perform(post("/api/urls")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(url)))
            .andExpect(status().isCreated());

        // Validate the Url in the database
        List<Url> urlList = urlRepository.findAll();
        assertThat(urlList).hasSize(databaseSizeBeforeCreate + 1);
        Url testUrl = urlList.get(urlList.size() - 1);
        assertThat(testUrl.getEntityType()).isEqualTo(DEFAULT_ENTITY_TYPE);
        assertThat(testUrl.getEntityId()).isEqualTo(DEFAULT_ENTITY_ID);
        assertThat(testUrl.getPath()).isEqualTo(DEFAULT_PATH);
        assertThat(testUrl.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testUrl.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
        assertThat(testUrl.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testUrl.getLastModifiedBy()).isEqualTo(DEFAULT_LAST_MODIFIED_BY);
        assertThat(testUrl.getLastModifiedDate()).isEqualTo(DEFAULT_LAST_MODIFIED_DATE);

        // Validate the Url in Elasticsearch
        Url urlEs = urlSearchRepository.findOne(testUrl.getId());
        assertThat(testUrl.getCreatedDate()).isEqualTo(testUrl.getCreatedDate());
        assertThat(testUrl.getLastModifiedDate()).isEqualTo(testUrl.getLastModifiedDate());
        assertThat(urlEs).isEqualToIgnoringGivenFields(testUrl, "createdDate", "lastModifiedDate");
    }

    @Test
    @Transactional
    public void createUrlWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = urlRepository.findAll().size();

        // Create the Url with an existing ID
        url.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUrlMockMvc.perform(post("/api/urls")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(url)))
            .andExpect(status().isBadRequest());

        // Validate the Url in the database
        List<Url> urlList = urlRepository.findAll();
        assertThat(urlList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllUrls() throws Exception {
        // Initialize the database
        urlRepository.saveAndFlush(url);

        // Get all the urlList
        restUrlMockMvc.perform(get("/api/urls?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(url.getId().intValue())))
            .andExpect(jsonPath("$.[*].entityType").value(hasItem(DEFAULT_ENTITY_TYPE.toString())))
            .andExpect(jsonPath("$.[*].entityId").value(hasItem(DEFAULT_ENTITY_ID)))
            .andExpect(jsonPath("$.[*].path").value(hasItem(DEFAULT_PATH.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(sameInstant(DEFAULT_LAST_MODIFIED_DATE))));
    }

    @Test
    @Transactional
    public void getUrl() throws Exception {
        // Initialize the database
        urlRepository.saveAndFlush(url);

        // Get the url
        restUrlMockMvc.perform(get("/api/urls/{id}", url.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(url.getId().intValue()))
            .andExpect(jsonPath("$.entityType").value(DEFAULT_ENTITY_TYPE.toString()))
            .andExpect(jsonPath("$.entityId").value(DEFAULT_ENTITY_ID))
            .andExpect(jsonPath("$.path").value(DEFAULT_PATH.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY.toString()))
            .andExpect(jsonPath("$.createdDate").value(sameInstant(DEFAULT_CREATED_DATE)))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY.toString()))
            .andExpect(jsonPath("$.lastModifiedDate").value(sameInstant(DEFAULT_LAST_MODIFIED_DATE)));
    }

    @Test
    @Transactional
    public void getNonExistingUrl() throws Exception {
        // Get the url
        restUrlMockMvc.perform(get("/api/urls/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUrl() throws Exception {
        // Initialize the database
        urlService.save(url);

        int databaseSizeBeforeUpdate = urlRepository.findAll().size();

        // Update the url
        Url updatedUrl = urlRepository.findOne(url.getId());
        // Disconnect from session so that the updates on updatedUrl are not directly saved in db
        em.detach(updatedUrl);
        updatedUrl
            .entityType(UPDATED_ENTITY_TYPE)
            .entityId(UPDATED_ENTITY_ID)
            .path(UPDATED_PATH)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restUrlMockMvc.perform(put("/api/urls")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedUrl)))
            .andExpect(status().isOk());

        // Validate the Url in the database
        List<Url> urlList = urlRepository.findAll();
        assertThat(urlList).hasSize(databaseSizeBeforeUpdate);
        Url testUrl = urlList.get(urlList.size() - 1);
        assertThat(testUrl.getEntityType()).isEqualTo(UPDATED_ENTITY_TYPE);
        assertThat(testUrl.getEntityId()).isEqualTo(UPDATED_ENTITY_ID);
        assertThat(testUrl.getPath()).isEqualTo(UPDATED_PATH);
        assertThat(testUrl.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testUrl.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testUrl.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testUrl.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
        assertThat(testUrl.getLastModifiedDate()).isEqualTo(UPDATED_LAST_MODIFIED_DATE);

        // Validate the Url in Elasticsearch
        Url urlEs = urlSearchRepository.findOne(testUrl.getId());
        assertThat(testUrl.getCreatedDate()).isEqualTo(testUrl.getCreatedDate());
        assertThat(testUrl.getLastModifiedDate()).isEqualTo(testUrl.getLastModifiedDate());
        assertThat(urlEs).isEqualToIgnoringGivenFields(testUrl, "createdDate", "lastModifiedDate");
    }

    @Test
    @Transactional
    public void updateNonExistingUrl() throws Exception {
        int databaseSizeBeforeUpdate = urlRepository.findAll().size();

        // Create the Url

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restUrlMockMvc.perform(put("/api/urls")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(url)))
            .andExpect(status().isCreated());

        // Validate the Url in the database
        List<Url> urlList = urlRepository.findAll();
        assertThat(urlList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteUrl() throws Exception {
        // Initialize the database
        urlService.save(url);

        int databaseSizeBeforeDelete = urlRepository.findAll().size();

        // Get the url
        restUrlMockMvc.perform(delete("/api/urls/{id}", url.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean urlExistsInEs = urlSearchRepository.exists(url.getId());
        assertThat(urlExistsInEs).isFalse();

        // Validate the database is empty
        List<Url> urlList = urlRepository.findAll();
        assertThat(urlList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchUrl() throws Exception {
        // Initialize the database
        urlService.save(url);

        // Search the url
        restUrlMockMvc.perform(get("/api/_search/urls?query=id:" + url.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(url.getId().intValue())))
            .andExpect(jsonPath("$.[*].entityType").value(hasItem(DEFAULT_ENTITY_TYPE.toString())))
            .andExpect(jsonPath("$.[*].entityId").value(hasItem(DEFAULT_ENTITY_ID)))
            .andExpect(jsonPath("$.[*].path").value(hasItem(DEFAULT_PATH.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(sameInstant(DEFAULT_LAST_MODIFIED_DATE))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Url.class);
        Url url1 = new Url();
        url1.setId(1L);
        Url url2 = new Url();
        url2.setId(url1.getId());
        assertThat(url1).isEqualTo(url2);
        url2.setId(2L);
        assertThat(url1).isNotEqualTo(url2);
        url1.setId(null);
        assertThat(url1).isNotEqualTo(url2);
    }
}
