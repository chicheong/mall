package com.wongs.service;

import com.wongs.domain.ProductItemHistory;
import com.wongs.repository.ProductItemHistoryRepository;
import com.wongs.repository.search.ProductItemHistorySearchRepository;
import com.wongs.service.dto.ProductItemHistoryDTO;
import com.wongs.service.mapper.ProductItemHistoryMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link ProductItemHistory}.
 */
@Service
@Transactional
public class ProductItemHistoryService {

    private final Logger log = LoggerFactory.getLogger(ProductItemHistoryService.class);

    private final ProductItemHistoryRepository productItemHistoryRepository;

    private final ProductItemHistoryMapper productItemHistoryMapper;

    private final ProductItemHistorySearchRepository productItemHistorySearchRepository;

    public ProductItemHistoryService(ProductItemHistoryRepository productItemHistoryRepository, ProductItemHistoryMapper productItemHistoryMapper, ProductItemHistorySearchRepository productItemHistorySearchRepository) {
        this.productItemHistoryRepository = productItemHistoryRepository;
        this.productItemHistoryMapper = productItemHistoryMapper;
        this.productItemHistorySearchRepository = productItemHistorySearchRepository;
    }

    /**
     * Save a productItemHistory.
     *
     * @param productItemHistoryDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductItemHistoryDTO save(ProductItemHistoryDTO productItemHistoryDTO) {
        log.debug("Request to save ProductItemHistory : {}", productItemHistoryDTO);
        ProductItemHistory productItemHistory = productItemHistoryMapper.toEntity(productItemHistoryDTO);
        productItemHistory = productItemHistoryRepository.save(productItemHistory);
        ProductItemHistoryDTO result = productItemHistoryMapper.toDto(productItemHistory);
        productItemHistorySearchRepository.save(productItemHistory);
        return result;
    }

    /**
     * Get all the productItemHistories.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ProductItemHistoryDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ProductItemHistories");
        return productItemHistoryRepository.findAll(pageable)
            .map(productItemHistoryMapper::toDto);
    }

    /**
     * Get one productItemHistory by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProductItemHistoryDTO> findOne(Long id) {
        log.debug("Request to get ProductItemHistory : {}", id);
        return productItemHistoryRepository.findById(id)
            .map(productItemHistoryMapper::toDto);
    }

    /**
     * Delete the productItemHistory by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ProductItemHistory : {}", id);
        productItemHistoryRepository.deleteById(id);
        productItemHistorySearchRepository.deleteById(id);
    }

    /**
     * Search for the productItemHistory corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ProductItemHistoryDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of ProductItemHistories for query {}", query);
        return productItemHistorySearchRepository.search(queryStringQuery(query), pageable)
            .map(productItemHistoryMapper::toDto);
    }
}
