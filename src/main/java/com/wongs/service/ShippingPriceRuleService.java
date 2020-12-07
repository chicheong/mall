package com.wongs.service;

import com.wongs.domain.ShippingPriceRule;
import com.wongs.repository.ShippingPriceRuleRepository;
import com.wongs.repository.search.ShippingPriceRuleSearchRepository;
import com.wongs.service.dto.ShippingPriceRuleDTO;
import com.wongs.service.mapper.ShippingPriceRuleMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link ShippingPriceRule}.
 */
@Service
@Transactional
public class ShippingPriceRuleService {

    private final Logger log = LoggerFactory.getLogger(ShippingPriceRuleService.class);

    private final ShippingPriceRuleRepository shippingPriceRuleRepository;

    private final ShippingPriceRuleMapper shippingPriceRuleMapper;

    private final ShippingPriceRuleSearchRepository shippingPriceRuleSearchRepository;

    public ShippingPriceRuleService(ShippingPriceRuleRepository shippingPriceRuleRepository, ShippingPriceRuleMapper shippingPriceRuleMapper, ShippingPriceRuleSearchRepository shippingPriceRuleSearchRepository) {
        this.shippingPriceRuleRepository = shippingPriceRuleRepository;
        this.shippingPriceRuleMapper = shippingPriceRuleMapper;
        this.shippingPriceRuleSearchRepository = shippingPriceRuleSearchRepository;
    }

    /**
     * Save a shippingPriceRule.
     *
     * @param shippingPriceRuleDTO the entity to save.
     * @return the persisted entity.
     */
    public ShippingPriceRuleDTO save(ShippingPriceRuleDTO shippingPriceRuleDTO) {
        log.debug("Request to save ShippingPriceRule : {}", shippingPriceRuleDTO);
        ShippingPriceRule shippingPriceRule = shippingPriceRuleMapper.toEntity(shippingPriceRuleDTO);
        shippingPriceRule = shippingPriceRuleRepository.save(shippingPriceRule);
        ShippingPriceRuleDTO result = shippingPriceRuleMapper.toDto(shippingPriceRule);
        shippingPriceRuleSearchRepository.save(shippingPriceRule);
        return result;
    }

    /**
     * Get all the shippingPriceRules.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ShippingPriceRuleDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ShippingPriceRules");
        return shippingPriceRuleRepository.findAll(pageable)
            .map(shippingPriceRuleMapper::toDto);
    }

    /**
     * Get one shippingPriceRule by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ShippingPriceRuleDTO> findOne(Long id) {
        log.debug("Request to get ShippingPriceRule : {}", id);
        return shippingPriceRuleRepository.findById(id)
            .map(shippingPriceRuleMapper::toDto);
    }

    /**
     * Delete the shippingPriceRule by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ShippingPriceRule : {}", id);
        shippingPriceRuleRepository.deleteById(id);
        shippingPriceRuleSearchRepository.deleteById(id);
    }

    /**
     * Search for the shippingPriceRule corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ShippingPriceRuleDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of ShippingPriceRules for query {}", query);
        return shippingPriceRuleSearchRepository.search(queryStringQuery(query), pageable)
            .map(shippingPriceRuleMapper::toDto);
    }
}
