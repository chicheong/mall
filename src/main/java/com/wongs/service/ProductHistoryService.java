package com.wongs.service;

import com.wongs.domain.ProductHistory;
import com.wongs.repository.ProductHistoryRepository;
import com.wongs.repository.search.ProductHistorySearchRepository;
import com.wongs.service.dto.ProductHistoryDTO;
import com.wongs.service.mapper.ProductHistoryMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link ProductHistory}.
 */
@Service
@Transactional
public class ProductHistoryService {

    private final Logger log = LoggerFactory.getLogger(ProductHistoryService.class);

    private final ProductHistoryRepository productHistoryRepository;

    private final ProductHistoryMapper productHistoryMapper;

    private final ProductHistorySearchRepository productHistorySearchRepository;

    public ProductHistoryService(ProductHistoryRepository productHistoryRepository, ProductHistoryMapper productHistoryMapper, ProductHistorySearchRepository productHistorySearchRepository) {
        this.productHistoryRepository = productHistoryRepository;
        this.productHistoryMapper = productHistoryMapper;
        this.productHistorySearchRepository = productHistorySearchRepository;
    }

    /**
     * Save a productHistory.
     *
     * @param productHistoryDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductHistoryDTO save(ProductHistoryDTO productHistoryDTO) {
        log.debug("Request to save ProductHistory : {}", productHistoryDTO);
        ProductHistory productHistory = productHistoryMapper.toEntity(productHistoryDTO);
        productHistory = productHistoryRepository.save(productHistory);
        ProductHistoryDTO result = productHistoryMapper.toDto(productHistory);
        productHistorySearchRepository.save(productHistory);
        return result;
    }

    /**
     * Get all the productHistories.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ProductHistoryDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ProductHistories");
        return productHistoryRepository.findAll(pageable)
            .map(productHistoryMapper::toDto);
    }

    /**
     * Get one productHistory by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProductHistoryDTO> findOne(Long id) {
        log.debug("Request to get ProductHistory : {}", id);
        return productHistoryRepository.findById(id)
            .map(productHistoryMapper::toDto);
    }

    /**
     * Delete the productHistory by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ProductHistory : {}", id);
        productHistoryRepository.deleteById(id);
        productHistorySearchRepository.deleteById(id);
    }

    /**
     * Search for the productHistory corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ProductHistoryDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of ProductHistories for query {}", query);
        return productHistorySearchRepository.search(queryStringQuery(query), pageable)
            .map(productHistoryMapper::toDto);
    }
}
