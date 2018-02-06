package com.wongs.service;

import com.wongs.domain.MyOrder;
import com.wongs.repository.MyOrderRepository;
import com.wongs.repository.search.MyOrderSearchRepository;
import com.wongs.service.dto.MyOrderDTO;
import com.wongs.service.mapper.MyOrderMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing MyOrder.
 */
@Service
@Transactional
public class MyOrderService {

    private final Logger log = LoggerFactory.getLogger(MyOrderService.class);

    private final MyOrderRepository myOrderRepository;

    private final MyOrderMapper myOrderMapper;

    private final MyOrderSearchRepository myOrderSearchRepository;

    public MyOrderService(MyOrderRepository myOrderRepository, MyOrderMapper myOrderMapper, MyOrderSearchRepository myOrderSearchRepository) {
        this.myOrderRepository = myOrderRepository;
        this.myOrderMapper = myOrderMapper;
        this.myOrderSearchRepository = myOrderSearchRepository;
    }

    /**
     * Save a myOrder.
     *
     * @param myOrderDTO the entity to save
     * @return the persisted entity
     */
    public MyOrderDTO save(MyOrderDTO myOrderDTO) {
        log.debug("Request to save MyOrder : {}", myOrderDTO);
        MyOrder myOrder = myOrderMapper.toEntity(myOrderDTO);
        myOrder = myOrderRepository.save(myOrder);
        MyOrderDTO result = myOrderMapper.toDto(myOrder);
        myOrderSearchRepository.save(myOrder);
        return result;
    }

    /**
     * Get all the myOrders.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<MyOrderDTO> findAll(Pageable pageable) {
        log.debug("Request to get all MyOrders");
        return myOrderRepository.findAll(pageable)
            .map(myOrderMapper::toDto);
    }

    /**
     * Get one myOrder by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public MyOrderDTO findOne(Long id) {
        log.debug("Request to get MyOrder : {}", id);
        MyOrder myOrder = myOrderRepository.findOne(id);
        return myOrderMapper.toDto(myOrder);
    }

    /**
     * Delete the myOrder by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete MyOrder : {}", id);
        myOrderRepository.delete(id);
        myOrderSearchRepository.delete(id);
    }

    /**
     * Search for the myOrder corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<MyOrderDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of MyOrders for query {}", query);
        Page<MyOrder> result = myOrderSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(myOrderMapper::toDto);
    }
}
