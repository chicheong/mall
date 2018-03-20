package com.wongs.service;

import com.wongs.domain.Url;
import com.wongs.repository.UrlRepository;
import com.wongs.repository.search.UrlSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Url.
 */
@Service
@Transactional
public class UrlService {

    private final Logger log = LoggerFactory.getLogger(UrlService.class);

    private final UrlRepository urlRepository;

    private final UrlSearchRepository urlSearchRepository;

    public UrlService(UrlRepository urlRepository, UrlSearchRepository urlSearchRepository) {
        this.urlRepository = urlRepository;
        this.urlSearchRepository = urlSearchRepository;
    }

    /**
     * Save a url.
     *
     * @param url the entity to save
     * @return the persisted entity
     */
    public Url save(Url url) {
        log.debug("Request to save Url : {}", url);
        Url result = urlRepository.save(url);
        urlSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the urls.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Url> findAll(Pageable pageable) {
        log.debug("Request to get all Urls");
        return urlRepository.findAll(pageable);
    }

    /**
     * Get one url by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Url findOne(Long id) {
        log.debug("Request to get Url : {}", id);
        return urlRepository.findOne(id);
    }

    /**
     * Delete the url by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Url : {}", id);
        urlRepository.delete(id);
        urlSearchRepository.delete(id);
    }

    /**
     * Search for the url corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Url> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Urls for query {}", query);
        Page<Url> result = urlSearchRepository.search(queryStringQuery(query), pageable);
        return result;
    }
}
