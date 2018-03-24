package com.wongs.service;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wongs.domain.Url;
import com.wongs.repository.UrlRepository;
import com.wongs.repository.search.UrlSearchRepository;
import com.wongs.service.dto.UrlDTO;
import com.wongs.service.mapper.UrlMapper;

/**
 * Service Implementation for managing Url.
 */
@Service
@Transactional
public class UrlService {

    private final Logger log = LoggerFactory.getLogger(UrlService.class);

    private final UrlRepository urlRepository;

    private final UrlMapper urlMapper;

    private final UrlSearchRepository urlSearchRepository;

    public UrlService(UrlRepository urlRepository, UrlMapper urlMapper, UrlSearchRepository urlSearchRepository) {
        this.urlRepository = urlRepository;
        this.urlMapper = urlMapper;
        this.urlSearchRepository = urlSearchRepository;
    }

    /**
     * Save a url.
     *
     * @param urlDTO the entity to save
     * @return the persisted entity
     */
    public UrlDTO save(UrlDTO urlDTO) {
        log.debug("Request to save Url : {}", urlDTO);
        Url url = urlMapper.toEntity(urlDTO);
        url = urlRepository.save(url);
        UrlDTO result = urlMapper.toDto(url);
        urlSearchRepository.save(url);
        return result;
    }

    /**
     * Get all the urls.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<UrlDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Urls");
        return urlRepository.findAll(pageable)
            .map(urlMapper::toDto);
    }

    /**
     * Get all url by entityType and entityId.
     *
     * @param entityType
     * @param entityId
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Set<Url> findByEntityTypeAndEntityId(String entityType, Long entityId) {
        log.debug("Request to get Url by entityType : {}, and entityId : {}", entityType, entityId);
        return urlRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }
    
    /**
     * Get one url by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public UrlDTO findOne(Long id) {
        log.debug("Request to get Url : {}", id);
        Url url = urlRepository.findOne(id);
        return urlMapper.toDto(url);
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
    public Page<UrlDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Urls for query {}", query);
        Page<Url> result = urlSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(urlMapper::toDto);
    }
}
