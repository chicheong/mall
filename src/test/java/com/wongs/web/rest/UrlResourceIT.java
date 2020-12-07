package com.wongs.web.rest;

import com.wongs.MallApp;
import com.wongs.domain.Url;
import com.wongs.repository.UrlRepository;
import com.wongs.repository.search.UrlSearchRepository;
import com.wongs.service.UrlService;
import com.wongs.service.dto.UrlDTO;
import com.wongs.service.mapper.UrlMapper;

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

/**
 * Integration tests for the {@link UrlResource} REST controller.
 */
@SpringBootTest(classes = MallApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class UrlResourceIT {

    private static final String DEFAULT_ENTITY_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_ENTITY_TYPE = "BBBBBBBBBB";

    private static final Long DEFAULT_ENTITY_ID = 1L;
    private static final Long UPDATED_ENTITY_ID = 2L;

    private static final String DEFAULT_PATH = "AAAAAAAAAA";
    private static final String UPDATED_PATH = "BBBBBBBBBB";

    private static final String DEFAULT_FILE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FILE_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_SEQUENCE = 1;
    private static final Integer UPDATED_SEQUENCE = 2;

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
    private UrlMapper urlMapper;

    @Autowired
    private UrlService urlService;

    /**
     * This repository is mocked in the com.wongs.repository.search test package.
     *
     * @see com.wongs.repository.search.UrlSearchRepositoryMockConfiguration
     */
    @Autowired
    private UrlSearchRepository mockUrlSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUrlMockMvc;

    private Url url;

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
            .fileName(DEFAULT_FILE_NAME)
            .sequence(DEFAULT_SEQUENCE)
            .description(DEFAULT_DESCRIPTION)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY)
            .lastModifiedDate(DEFAULT_LAST_MODIFIED_DATE);
        return url;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Url createUpdatedEntity(EntityManager em) {
        Url url = new Url()
            .entityType(UPDATED_ENTITY_TYPE)
            .entityId(UPDATED_ENTITY_ID)
            .path(UPDATED_PATH)
            .fileName(UPDATED_FILE_NAME)
            .sequence(UPDATED_SEQUENCE)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        return url;
    }

    @BeforeEach
    public void initTest() {
        url = createEntity(em);
    }

    @Test
    @Transactional
    public void createUrl() throws Exception {
        int databaseSizeBeforeCreate = urlRepository.findAll().size();

        // Create the Url
        UrlDTO urlDTO = urlMapper.toDto(url);
        restUrlMockMvc.perform(post("/api/urls")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(urlDTO)))
            .andExpect(status().isCreated());

        // Validate the Url in the database
        List<Url> urlList = urlRepository.findAll();
        assertThat(urlList).hasSize(databaseSizeBeforeCreate + 1);
        Url testUrl = urlList.get(urlList.size() - 1);
        assertThat(testUrl.getEntityType()).isEqualTo(DEFAULT_ENTITY_TYPE);
        assertThat(testUrl.getEntityId()).isEqualTo(DEFAULT_ENTITY_ID);
        assertThat(testUrl.getPath()).isEqualTo(DEFAULT_PATH);
        assertThat(testUrl.getFileName()).isEqualTo(DEFAULT_FILE_NAME);
        assertThat(testUrl.getSequence()).isEqualTo(DEFAULT_SEQUENCE);
        assertThat(testUrl.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testUrl.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
        assertThat(testUrl.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testUrl.getLastModifiedBy()).isEqualTo(DEFAULT_LAST_MODIFIED_BY);
        assertThat(testUrl.getLastModifiedDate()).isEqualTo(DEFAULT_LAST_MODIFIED_DATE);

        // Validate the Url in Elasticsearch
        verify(mockUrlSearchRepository, times(1)).save(testUrl);
    }

    @Test
    @Transactional
    public void createUrlWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = urlRepository.findAll().size();

        // Create the Url with an existing ID
        url.setId(1L);
        UrlDTO urlDTO = urlMapper.toDto(url);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUrlMockMvc.perform(post("/api/urls")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(urlDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Url in the database
        List<Url> urlList = urlRepository.findAll();
        assertThat(urlList).hasSize(databaseSizeBeforeCreate);

        // Validate the Url in Elasticsearch
        verify(mockUrlSearchRepository, times(0)).save(url);
    }


    @Test
    @Transactional
    public void getAllUrls() throws Exception {
        // Initialize the database
        urlRepository.saveAndFlush(url);

        // Get all the urlList
        restUrlMockMvc.perform(get("/api/urls?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(url.getId().intValue())))
            .andExpect(jsonPath("$.[*].entityType").value(hasItem(DEFAULT_ENTITY_TYPE)))
            .andExpect(jsonPath("$.[*].entityId").value(hasItem(DEFAULT_ENTITY_ID.intValue())))
            .andExpect(jsonPath("$.[*].path").value(hasItem(DEFAULT_PATH)))
            .andExpect(jsonPath("$.[*].fileName").value(hasItem(DEFAULT_FILE_NAME)))
            .andExpect(jsonPath("$.[*].sequence").value(hasItem(DEFAULT_SEQUENCE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(url.getId().intValue()))
            .andExpect(jsonPath("$.entityType").value(DEFAULT_ENTITY_TYPE))
            .andExpect(jsonPath("$.entityId").value(DEFAULT_ENTITY_ID.intValue()))
            .andExpect(jsonPath("$.path").value(DEFAULT_PATH))
            .andExpect(jsonPath("$.fileName").value(DEFAULT_FILE_NAME))
            .andExpect(jsonPath("$.sequence").value(DEFAULT_SEQUENCE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(sameInstant(DEFAULT_CREATED_DATE)))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
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
        urlRepository.saveAndFlush(url);

        int databaseSizeBeforeUpdate = urlRepository.findAll().size();

        // Update the url
        Url updatedUrl = urlRepository.findById(url.getId()).get();
        // Disconnect from session so that the updates on updatedUrl are not directly saved in db
        em.detach(updatedUrl);
        updatedUrl
            .entityType(UPDATED_ENTITY_TYPE)
            .entityId(UPDATED_ENTITY_ID)
            .path(UPDATED_PATH)
            .fileName(UPDATED_FILE_NAME)
            .sequence(UPDATED_SEQUENCE)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        UrlDTO urlDTO = urlMapper.toDto(updatedUrl);

        restUrlMockMvc.perform(put("/api/urls")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(urlDTO)))
            .andExpect(status().isOk());

        // Validate the Url in the database
        List<Url> urlList = urlRepository.findAll();
        assertThat(urlList).hasSize(databaseSizeBeforeUpdate);
        Url testUrl = urlList.get(urlList.size() - 1);
        assertThat(testUrl.getEntityType()).isEqualTo(UPDATED_ENTITY_TYPE);
        assertThat(testUrl.getEntityId()).isEqualTo(UPDATED_ENTITY_ID);
        assertThat(testUrl.getPath()).isEqualTo(UPDATED_PATH);
        assertThat(testUrl.getFileName()).isEqualTo(UPDATED_FILE_NAME);
        assertThat(testUrl.getSequence()).isEqualTo(UPDATED_SEQUENCE);
        assertThat(testUrl.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testUrl.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testUrl.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testUrl.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);
        assertThat(testUrl.getLastModifiedDate()).isEqualTo(UPDATED_LAST_MODIFIED_DATE);

        // Validate the Url in Elasticsearch
        verify(mockUrlSearchRepository, times(1)).save(testUrl);
    }

    @Test
    @Transactional
    public void updateNonExistingUrl() throws Exception {
        int databaseSizeBeforeUpdate = urlRepository.findAll().size();

        // Create the Url
        UrlDTO urlDTO = urlMapper.toDto(url);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUrlMockMvc.perform(put("/api/urls")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(urlDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Url in the database
        List<Url> urlList = urlRepository.findAll();
        assertThat(urlList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Url in Elasticsearch
        verify(mockUrlSearchRepository, times(0)).save(url);
    }

    @Test
    @Transactional
    public void deleteUrl() throws Exception {
        // Initialize the database
        urlRepository.saveAndFlush(url);

        int databaseSizeBeforeDelete = urlRepository.findAll().size();

        // Delete the url
        restUrlMockMvc.perform(delete("/api/urls/{id}", url.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Url> urlList = urlRepository.findAll();
        assertThat(urlList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Url in Elasticsearch
        verify(mockUrlSearchRepository, times(1)).deleteById(url.getId());
    }

    @Test
    @Transactional
    public void searchUrl() throws Exception {
        // Initialize the database
        urlRepository.saveAndFlush(url);
        when(mockUrlSearchRepository.search(queryStringQuery("id:" + url.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(url), PageRequest.of(0, 1), 1));
        // Search the url
        restUrlMockMvc.perform(get("/api/_search/urls?query=id:" + url.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(url.getId().intValue())))
            .andExpect(jsonPath("$.[*].entityType").value(hasItem(DEFAULT_ENTITY_TYPE)))
            .andExpect(jsonPath("$.[*].entityId").value(hasItem(DEFAULT_ENTITY_ID.intValue())))
            .andExpect(jsonPath("$.[*].path").value(hasItem(DEFAULT_PATH)))
            .andExpect(jsonPath("$.[*].fileName").value(hasItem(DEFAULT_FILE_NAME)))
            .andExpect(jsonPath("$.[*].sequence").value(hasItem(DEFAULT_SEQUENCE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(sameInstant(DEFAULT_LAST_MODIFIED_DATE))));
    }
}
