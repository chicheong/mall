package com.wongs.service;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wongs.domain.Shipping;
import com.wongs.repository.ShippingRepository;
import com.wongs.repository.search.ShippingSearchRepository;
import com.wongs.service.dto.MyOrderDTO;
import com.wongs.service.dto.ShippingDTO;
import com.wongs.service.mapper.MyOrderMapper;
import com.wongs.service.mapper.ShippingMapper;

/**
 * Service Implementation for managing Shipping.
 */
@Service
@Transactional
public class ShippingService {

    private final Logger log = LoggerFactory.getLogger(ShippingService.class);

    private final ShippingMapper shippingMapper;
    private final MyOrderMapper myOrderMapper;
    
    private final ShippingRepository shippingRepository;

    private final ShippingSearchRepository shippingSearchRepository;

    public ShippingService(ShippingMapper shippingMapper, MyOrderMapper myOrderMapper, ShippingRepository shippingRepository, ShippingSearchRepository shippingSearchRepository) {
    	this.shippingMapper = shippingMapper;
    	this.myOrderMapper = myOrderMapper;
    	this.shippingRepository = shippingRepository;
        this.shippingSearchRepository = shippingSearchRepository;
    }

    /**
     * Save a shipping.
     *
     * @param shippingDTO the entity to save
     * @return the persisted entity
     */
    public ShippingDTO save(ShippingDTO shippingDTO) {
        log.debug("Request to save Shipping : {}", shippingDTO);
        Shipping shipping = shippingMapper.toEntity(shippingDTO);
        shipping = shippingRepository.save(shipping);
        ShippingDTO result = shippingMapper.toDto(shipping);
        shippingSearchRepository.save(shipping);
        return result;
    }

    /**
     * Get all the shippings.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<ShippingDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Shippings");
        return shippingRepository.findAll(pageable)
            .map(shippingMapper::toDto);
    }

    /**
     * Get one shipping by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public ShippingDTO findOne(Long id) {
        log.debug("Request to get Shipping : {}", id);
        Shipping shipping = shippingRepository.findOne(id);
        return shippingMapper.toDto(shipping);
    }

    /**
     * Get one shipping by MyOrder.
     *
     * @param MyOrder
     * @return the entity
     */
    @Transactional(readOnly = true)
    public ShippingDTO findByOrder(MyOrderDTO myOrderDTO) {
        log.debug("Request to get Shipping from MyOrder : {}", myOrderDTO);
        Shipping shipping = shippingRepository.findByOrder(myOrderMapper.toEntity(myOrderDTO));
        return shippingMapper.toDto(shipping);
    }
    
    /**
     * Delete the shipping by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Shipping : {}", id);
        shippingRepository.delete(id);
        shippingSearchRepository.delete(id);
    }

    /**
     * Search for the shipping corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<ShippingDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Shippings for query {}", query);
        Page<Shipping> result = shippingSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(shippingMapper::toDto);
    }
}
