package com.wongs.service;

import com.wongs.domain.ProductStyleHistory;
import com.wongs.repository.ProductStyleHistoryRepository;
import com.wongs.repository.search.ProductStyleHistorySearchRepository;
import com.wongs.service.dto.ProductStyleHistoryDTO;
import com.wongs.service.mapper.ProductStyleHistoryMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link ProductStyleHistory}.
 */
@Service
@Transactional
public class ProductStyleHistoryService {

    private final Logger log = LoggerFactory.getLogger(ProductStyleHistoryService.class);

    private final ProductStyleHistoryRepository productStyleHistoryRepository;

    private final ProductStyleHistoryMapper productStyleHistoryMapper;

    private final ProductStyleHistorySearchRepository productStyleHistorySearchRepository;

    public ProductStyleHistoryService(ProductStyleHistoryRepository productStyleHistoryRepository, ProductStyleHistoryMapper productStyleHistoryMapper, ProductStyleHistorySearchRepository productStyleHistorySearchRepository) {
        this.productStyleHistoryRepository = productStyleHistoryRepository;
        this.productStyleHistoryMapper = productStyleHistoryMapper;
        this.productStyleHistorySearchRepository = productStyleHistorySearchRepository;
    }

    /**
     * Save a productStyleHistory.
     *
     * @param productStyleHistoryDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductStyleHistoryDTO save(ProductStyleHistoryDTO productStyleHistoryDTO) {
        log.debug("Request to save ProductStyleHistory : {}", productStyleHistoryDTO);
        ProductStyleHistory productStyleHistory = productStyleHistoryMapper.toEntity(productStyleHistoryDTO);
        productStyleHistory = productStyleHistoryRepository.save(productStyleHistory);
        ProductStyleHistoryDTO result = productStyleHistoryMapper.toDto(productStyleHistory);
        productStyleHistorySearchRepository.save(productStyleHistory);
        return result;
    }

    /**
     * Get all the productStyleHistories.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ProductStyleHistoryDTO> findAll() {
        log.debug("Request to get all ProductStyleHistories");
        return productStyleHistoryRepository.findAll().stream()
            .map(productStyleHistoryMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one productStyleHistory by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProductStyleHistoryDTO> findOne(Long id) {
        log.debug("Request to get ProductStyleHistory : {}", id);
        return productStyleHistoryRepository.findById(id)
            .map(productStyleHistoryMapper::toDto);
    }

    /**
     * Delete the productStyleHistory by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ProductStyleHistory : {}", id);
        productStyleHistoryRepository.deleteById(id);
        productStyleHistorySearchRepository.deleteById(id);
    }

    /**
     * Search for the productStyleHistory corresponding to the query.
     *
     * @param query the query of the search.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ProductStyleHistoryDTO> search(String query) {
        log.debug("Request to search ProductStyleHistories for query {}", query);
        return StreamSupport
            .stream(productStyleHistorySearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .map(productStyleHistoryMapper::toDto)
            .collect(Collectors.toList());
    }
}
