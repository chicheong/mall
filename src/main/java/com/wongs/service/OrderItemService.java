package com.wongs.service;

import com.wongs.domain.OrderItem;
import com.wongs.repository.OrderItemRepository;
import com.wongs.repository.search.OrderItemSearchRepository;
import com.wongs.service.dto.OrderItemDTO;
import com.wongs.service.mapper.OrderItemMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link OrderItem}.
 */
@Service
@Transactional
public class OrderItemService {

    private final Logger log = LoggerFactory.getLogger(OrderItemService.class);

    private final OrderItemRepository orderItemRepository;

    private final OrderItemMapper orderItemMapper;

    private final OrderItemSearchRepository orderItemSearchRepository;

    public OrderItemService(OrderItemRepository orderItemRepository, OrderItemMapper orderItemMapper, OrderItemSearchRepository orderItemSearchRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderItemMapper = orderItemMapper;
        this.orderItemSearchRepository = orderItemSearchRepository;
    }

    /**
     * Save a orderItem.
     *
     * @param orderItemDTO the entity to save.
     * @return the persisted entity.
     */
    public OrderItemDTO save(OrderItemDTO orderItemDTO) {
        log.debug("Request to save OrderItem : {}", orderItemDTO);
        OrderItem orderItem = orderItemMapper.toEntity(orderItemDTO);
        orderItem = orderItemRepository.save(orderItem);
        OrderItemDTO result = orderItemMapper.toDto(orderItem);
        orderItemSearchRepository.save(orderItem);
        return result;
    }

    /**
     * Get all the orderItems.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<OrderItemDTO> findAll(Pageable pageable) {
        log.debug("Request to get all OrderItems");
        return orderItemRepository.findAll(pageable)
            .map(orderItemMapper::toDto);
    }


    /**
     *  Get all the orderItems where ProductItem is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true) 
    public List<OrderItemDTO> findAllWhereProductItemIsNull() {
        log.debug("Request to get all orderItems where ProductItem is null");
        return StreamSupport
            .stream(orderItemRepository.findAll().spliterator(), false)
            .filter(orderItem -> orderItem.getProductItem() == null)
            .map(orderItemMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one orderItem by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<OrderItemDTO> findOne(Long id) {
        log.debug("Request to get OrderItem : {}", id);
        return orderItemRepository.findById(id)
            .map(orderItemMapper::toDto);
    }

    /**
     * Delete the orderItem by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete OrderItem : {}", id);
        orderItemRepository.deleteById(id);
        orderItemSearchRepository.deleteById(id);
    }

    /**
     * Search for the orderItem corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<OrderItemDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of OrderItems for query {}", query);
        return orderItemSearchRepository.search(queryStringQuery(query), pageable)
            .map(orderItemMapper::toDto);
    }
}
