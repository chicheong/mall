package com.wongs.service;

import com.wongs.domain.ProductStyle;
import com.wongs.repository.ProductStyleRepository;
import com.wongs.repository.search.ProductStyleSearchRepository;
import com.wongs.service.dto.ProductStyleDTO;
import com.wongs.service.mapper.ProductStyleMapper;
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
 * Service Implementation for managing {@link ProductStyle}.
 */
@Service
@Transactional
public class ProductStyleService {

    private final Logger log = LoggerFactory.getLogger(ProductStyleService.class);

    private final ProductStyleRepository productStyleRepository;

    private final ProductStyleMapper productStyleMapper;

    private final ProductStyleSearchRepository productStyleSearchRepository;

    public ProductStyleService(ProductStyleRepository productStyleRepository, ProductStyleMapper productStyleMapper, ProductStyleSearchRepository productStyleSearchRepository) {
        this.productStyleRepository = productStyleRepository;
        this.productStyleMapper = productStyleMapper;
        this.productStyleSearchRepository = productStyleSearchRepository;
    }

    /**
     * Save a productStyle.
     *
     * @param productStyleDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductStyleDTO save(ProductStyleDTO productStyleDTO) {
        log.debug("Request to save ProductStyle : {}", productStyleDTO);
        ProductStyle productStyle = productStyleMapper.toEntity(productStyleDTO);
        productStyle = productStyleRepository.save(productStyle);
        ProductStyleDTO result = productStyleMapper.toDto(productStyle);
        productStyleSearchRepository.save(productStyle);
        return result;
    }

    /**
     * Get all the productStyles.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ProductStyleDTO> findAll() {
        log.debug("Request to get all ProductStyles");
        return productStyleRepository.findAll().stream()
            .map(productStyleMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one productStyle by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProductStyleDTO> findOne(Long id) {
        log.debug("Request to get ProductStyle : {}", id);
        return productStyleRepository.findById(id)
            .map(productStyleMapper::toDto);
    }

    /**
     * Delete the productStyle by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ProductStyle : {}", id);
        productStyleRepository.deleteById(id);
        productStyleSearchRepository.deleteById(id);
    }

    /**
     * Search for the productStyle corresponding to the query.
     *
     * @param query the query of the search.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ProductStyleDTO> search(String query) {
        log.debug("Request to search ProductStyles for query {}", query);
        return StreamSupport
            .stream(productStyleSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .map(productStyleMapper::toDto)
            .collect(Collectors.toList());
    }
}
