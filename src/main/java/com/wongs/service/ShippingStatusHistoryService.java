package com.wongs.service;

import com.wongs.domain.ShippingStatusHistory;
import com.wongs.repository.ShippingStatusHistoryRepository;
import com.wongs.repository.search.ShippingStatusHistorySearchRepository;
import com.wongs.service.dto.ShippingStatusHistoryDTO;
import com.wongs.service.mapper.ShippingStatusHistoryMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link ShippingStatusHistory}.
 */
@Service
@Transactional
public class ShippingStatusHistoryService {

    private final Logger log = LoggerFactory.getLogger(ShippingStatusHistoryService.class);

    private final ShippingStatusHistoryRepository shippingStatusHistoryRepository;

    private final ShippingStatusHistoryMapper shippingStatusHistoryMapper;

    private final ShippingStatusHistorySearchRepository shippingStatusHistorySearchRepository;

    public ShippingStatusHistoryService(ShippingStatusHistoryRepository shippingStatusHistoryRepository, ShippingStatusHistoryMapper shippingStatusHistoryMapper, ShippingStatusHistorySearchRepository shippingStatusHistorySearchRepository) {
        this.shippingStatusHistoryRepository = shippingStatusHistoryRepository;
        this.shippingStatusHistoryMapper = shippingStatusHistoryMapper;
        this.shippingStatusHistorySearchRepository = shippingStatusHistorySearchRepository;
    }

    /**
     * Save a shippingStatusHistory.
     *
     * @param shippingStatusHistoryDTO the entity to save.
     * @return the persisted entity.
     */
    public ShippingStatusHistoryDTO save(ShippingStatusHistoryDTO shippingStatusHistoryDTO) {
        log.debug("Request to save ShippingStatusHistory : {}", shippingStatusHistoryDTO);
        ShippingStatusHistory shippingStatusHistory = shippingStatusHistoryMapper.toEntity(shippingStatusHistoryDTO);
        shippingStatusHistory = shippingStatusHistoryRepository.save(shippingStatusHistory);
        ShippingStatusHistoryDTO result = shippingStatusHistoryMapper.toDto(shippingStatusHistory);
        shippingStatusHistorySearchRepository.save(shippingStatusHistory);
        return result;
    }

    /**
     * Get all the shippingStatusHistories.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ShippingStatusHistoryDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ShippingStatusHistories");
        return shippingStatusHistoryRepository.findAll(pageable)
            .map(shippingStatusHistoryMapper::toDto);
    }

    /**
     * Get one shippingStatusHistory by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ShippingStatusHistoryDTO> findOne(Long id) {
        log.debug("Request to get ShippingStatusHistory : {}", id);
        return shippingStatusHistoryRepository.findById(id)
            .map(shippingStatusHistoryMapper::toDto);
    }

    /**
     * Delete the shippingStatusHistory by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ShippingStatusHistory : {}", id);
        shippingStatusHistoryRepository.deleteById(id);
        shippingStatusHistorySearchRepository.deleteById(id);
    }

    /**
     * Search for the shippingStatusHistory corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ShippingStatusHistoryDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of ShippingStatusHistories for query {}", query);
        return shippingStatusHistorySearchRepository.search(queryStringQuery(query), pageable)
            .map(shippingStatusHistoryMapper::toDto);
    }
}
