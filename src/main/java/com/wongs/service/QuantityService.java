package com.wongs.service;

import com.wongs.domain.Quantity;
import com.wongs.repository.QuantityRepository;
import com.wongs.repository.search.QuantitySearchRepository;
import com.wongs.service.dto.QuantityDTO;
import com.wongs.service.mapper.QuantityMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Quantity}.
 */
@Service
@Transactional
public class QuantityService {

    private final Logger log = LoggerFactory.getLogger(QuantityService.class);

    private final QuantityRepository quantityRepository;

    private final QuantityMapper quantityMapper;

    private final QuantitySearchRepository quantitySearchRepository;

    public QuantityService(QuantityRepository quantityRepository, QuantityMapper quantityMapper, QuantitySearchRepository quantitySearchRepository) {
        this.quantityRepository = quantityRepository;
        this.quantityMapper = quantityMapper;
        this.quantitySearchRepository = quantitySearchRepository;
    }

    /**
     * Save a quantity.
     *
     * @param quantityDTO the entity to save.
     * @return the persisted entity.
     */
    public QuantityDTO save(QuantityDTO quantityDTO) {
        log.debug("Request to save Quantity : {}", quantityDTO);
        Quantity quantity = quantityMapper.toEntity(quantityDTO);
        quantity = quantityRepository.save(quantity);
        QuantityDTO result = quantityMapper.toDto(quantity);
        quantitySearchRepository.save(quantity);
        return result;
    }

    /**
     * Get all the quantities.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<QuantityDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Quantities");
        return quantityRepository.findAll(pageable)
            .map(quantityMapper::toDto);
    }

    /**
     * Get one quantity by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<QuantityDTO> findOne(Long id) {
        log.debug("Request to get Quantity : {}", id);
        return quantityRepository.findById(id)
            .map(quantityMapper::toDto);
    }

    /**
     * Delete the quantity by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Quantity : {}", id);
        quantityRepository.deleteById(id);
        quantitySearchRepository.deleteById(id);
    }

    /**
     * Search for the quantity corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<QuantityDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Quantities for query {}", query);
        return quantitySearchRepository.search(queryStringQuery(query), pageable)
            .map(quantityMapper::toDto);
    }
}
