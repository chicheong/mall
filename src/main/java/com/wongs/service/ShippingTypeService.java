package com.wongs.service;

import com.wongs.domain.ShippingType;
import com.wongs.repository.ShippingTypeRepository;
import com.wongs.repository.search.ShippingTypeSearchRepository;
import com.wongs.service.dto.ShippingTypeDTO;
import com.wongs.service.mapper.ShippingTypeMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link ShippingType}.
 */
@Service
@Transactional
public class ShippingTypeService {

    private final Logger log = LoggerFactory.getLogger(ShippingTypeService.class);

    private final ShippingTypeRepository shippingTypeRepository;

    private final ShippingTypeMapper shippingTypeMapper;

    private final ShippingTypeSearchRepository shippingTypeSearchRepository;

    public ShippingTypeService(ShippingTypeRepository shippingTypeRepository, ShippingTypeMapper shippingTypeMapper, ShippingTypeSearchRepository shippingTypeSearchRepository) {
        this.shippingTypeRepository = shippingTypeRepository;
        this.shippingTypeMapper = shippingTypeMapper;
        this.shippingTypeSearchRepository = shippingTypeSearchRepository;
    }

    /**
     * Save a shippingType.
     *
     * @param shippingTypeDTO the entity to save.
     * @return the persisted entity.
     */
    public ShippingTypeDTO save(ShippingTypeDTO shippingTypeDTO) {
        log.debug("Request to save ShippingType : {}", shippingTypeDTO);
        ShippingType shippingType = shippingTypeMapper.toEntity(shippingTypeDTO);
        shippingType = shippingTypeRepository.save(shippingType);
        ShippingTypeDTO result = shippingTypeMapper.toDto(shippingType);
        shippingTypeSearchRepository.save(shippingType);
        return result;
    }

    /**
     * Get all the shippingTypes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ShippingTypeDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ShippingTypes");
        return shippingTypeRepository.findAll(pageable)
            .map(shippingTypeMapper::toDto);
    }

    /**
     * Get one shippingType by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ShippingTypeDTO> findOne(Long id) {
        log.debug("Request to get ShippingType : {}", id);
        return shippingTypeRepository.findById(id)
            .map(shippingTypeMapper::toDto);
    }

    /**
     * Delete the shippingType by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ShippingType : {}", id);
        shippingTypeRepository.deleteById(id);
        shippingTypeSearchRepository.deleteById(id);
    }

    /**
     * Search for the shippingType corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ShippingTypeDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of ShippingTypes for query {}", query);
        return shippingTypeSearchRepository.search(queryStringQuery(query), pageable)
            .map(shippingTypeMapper::toDto);
    }
}
