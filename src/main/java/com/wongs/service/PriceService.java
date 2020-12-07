package com.wongs.service;

import com.wongs.domain.Price;
import com.wongs.repository.PriceRepository;
import com.wongs.repository.search.PriceSearchRepository;
import com.wongs.service.dto.PriceDTO;
import com.wongs.service.mapper.PriceMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Price}.
 */
@Service
@Transactional
public class PriceService {

    private final Logger log = LoggerFactory.getLogger(PriceService.class);

    private final PriceRepository priceRepository;

    private final PriceMapper priceMapper;

    private final PriceSearchRepository priceSearchRepository;

    public PriceService(PriceRepository priceRepository, PriceMapper priceMapper, PriceSearchRepository priceSearchRepository) {
        this.priceRepository = priceRepository;
        this.priceMapper = priceMapper;
        this.priceSearchRepository = priceSearchRepository;
    }

    /**
     * Save a price.
     *
     * @param priceDTO the entity to save.
     * @return the persisted entity.
     */
    public PriceDTO save(PriceDTO priceDTO) {
        log.debug("Request to save Price : {}", priceDTO);
        Price price = priceMapper.toEntity(priceDTO);
        price = priceRepository.save(price);
        PriceDTO result = priceMapper.toDto(price);
        priceSearchRepository.save(price);
        return result;
    }

    /**
     * Get all the prices.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<PriceDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Prices");
        return priceRepository.findAll(pageable)
            .map(priceMapper::toDto);
    }

    /**
     * Get one price by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PriceDTO> findOne(Long id) {
        log.debug("Request to get Price : {}", id);
        return priceRepository.findById(id)
            .map(priceMapper::toDto);
    }

    /**
     * Delete the price by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Price : {}", id);
        priceRepository.deleteById(id);
        priceSearchRepository.deleteById(id);
    }

    /**
     * Search for the price corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<PriceDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Prices for query {}", query);
        return priceSearchRepository.search(queryStringQuery(query), pageable)
            .map(priceMapper::toDto);
    }
}
