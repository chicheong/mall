package com.wongs.service;

import com.wongs.domain.OrderShop;
import com.wongs.repository.OrderShopRepository;
import com.wongs.repository.search.OrderShopSearchRepository;
import com.wongs.service.dto.OrderShopDTO;
import com.wongs.service.mapper.OrderShopMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link OrderShop}.
 */
@Service
@Transactional
public class OrderShopService {

    private final Logger log = LoggerFactory.getLogger(OrderShopService.class);

    private final OrderShopRepository orderShopRepository;

    private final OrderShopMapper orderShopMapper;

    private final OrderShopSearchRepository orderShopSearchRepository;

    public OrderShopService(OrderShopRepository orderShopRepository, OrderShopMapper orderShopMapper, OrderShopSearchRepository orderShopSearchRepository) {
        this.orderShopRepository = orderShopRepository;
        this.orderShopMapper = orderShopMapper;
        this.orderShopSearchRepository = orderShopSearchRepository;
    }

    /**
     * Save a orderShop.
     *
     * @param orderShopDTO the entity to save.
     * @return the persisted entity.
     */
    public OrderShopDTO save(OrderShopDTO orderShopDTO) {
        log.debug("Request to save OrderShop : {}", orderShopDTO);
        OrderShop orderShop = orderShopMapper.toEntity(orderShopDTO);
        orderShop = orderShopRepository.save(orderShop);
        OrderShopDTO result = orderShopMapper.toDto(orderShop);
        orderShopSearchRepository.save(orderShop);
        return result;
    }

    /**
     * Get all the orderShops.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<OrderShopDTO> findAll(Pageable pageable) {
        log.debug("Request to get all OrderShops");
        return orderShopRepository.findAll(pageable)
            .map(orderShopMapper::toDto);
    }

    /**
     * Get one orderShop by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<OrderShopDTO> findOne(Long id) {
        log.debug("Request to get OrderShop : {}", id);
        return orderShopRepository.findById(id)
            .map(orderShopMapper::toDto);
    }

    /**
     * Delete the orderShop by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete OrderShop : {}", id);
        orderShopRepository.deleteById(id);
        orderShopSearchRepository.deleteById(id);
    }

    /**
     * Search for the orderShop corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<OrderShopDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of OrderShops for query {}", query);
        return orderShopSearchRepository.search(queryStringQuery(query), pageable)
            .map(orderShopMapper::toDto);
    }
}
