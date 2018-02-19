package com.wongs.service;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wongs.domain.MyAccount;
import com.wongs.domain.MyOrder;
import com.wongs.domain.OrderItem;
import com.wongs.domain.enumeration.CurrencyType;
import com.wongs.domain.enumeration.OrderStatus;
import com.wongs.repository.MyOrderRepository;
import com.wongs.repository.OrderItemRepository;
import com.wongs.repository.search.MyOrderSearchRepository;
import com.wongs.repository.search.OrderItemSearchRepository;
import com.wongs.service.dto.MyOrderDTO;
import com.wongs.service.mapper.MyOrderMapper;

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
    
    private final OrderItemRepository orderItemRepository;
    private final OrderItemSearchRepository orderItemSearchRepository;

    public MyOrderService(MyOrderRepository myOrderRepository, MyOrderMapper myOrderMapper, MyOrderSearchRepository myOrderSearchRepository,
    						OrderItemRepository orderItemRepository, OrderItemSearchRepository orderItemSearchRepository) {
        this.myOrderRepository = myOrderRepository;
        this.myOrderMapper = myOrderMapper;
        this.myOrderSearchRepository = myOrderSearchRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderItemSearchRepository = orderItemSearchRepository;
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
     * Add a productItem to a Pending MyOrder.
     *
     * @param myOrderDTO the entity to save
     * @return the persisted entity
     */
    public MyOrderDTO addToCart(MyAccount myAccount, final OrderItem orderItem) {
        log.debug("Request to add ProductItem : {} ", orderItem);
        MyOrder myOrder = this.findEntityByAccountAndStatus(myAccount, OrderStatus.PENDING).orElseGet(() -> this.createPendingOrder(myAccount));
//        myOrder.getItems().stream().filter(item -> orderItem.getProductItem().equals(item.getProductItem())).findFirst().map(item -> {
//        	item.setQuantity(item.getQuantity() + orderItem.getQuantity());
//        	orderItemRepository.save(item);
//        	return item; 
//        }).map(item -> {
//        	orderItem.setOrder(myOrder);
////        	orderItem.setCurrency(CurrencyType.HKD);
//        	orderItemRepository.save(orderItem);
//        	myOrder.getItems().add(orderItem);
//            myOrderRepository.save(myOrder);
//            myOrderSearchRepository.save(myOrder);     
//        	return orderItem;
//        });
        boolean itemFound = false;
        for (OrderItem item : myOrder.getItems()){
        	if (orderItem.getProductItem().equals(item.getProductItem())) {
        		item.setQuantity(item.getQuantity() + orderItem.getQuantity());
            	orderItemRepository.save(item);
        		itemFound = true;
        		break;
        	}
        }
        if (!itemFound){
        	orderItem.setOrder(myOrder);
        	orderItemRepository.save(orderItem);
        	myOrder.getItems().add(orderItem);
        	myOrderRepository.save(myOrder);
        	myOrderSearchRepository.save(myOrder); 
        }
        
        MyOrderDTO result = myOrderMapper.toDto(myOrder);
        return result;
    }

    public MyOrder createPendingOrder(MyAccount myAccount) {
    	MyOrder myOrder = new MyOrder();
    	myOrder.setAccount(myAccount);
    	myOrder.setStatus(OrderStatus.PENDING);
        myOrder = myOrderRepository.save(myOrder);
        myOrderSearchRepository.save(myOrder);
    	return myOrder;
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
     * Get one myOrder by MyAccount and OrderStatus.
     *
     * @param MyAccount and OrderStatus
     * @return the entity
     */
    @Transactional(readOnly = true)
    public MyOrderDTO findByAccountAndStatus(MyAccount account, OrderStatus status) {
        log.debug("Request to get MyOrder : {}", account, status);
        Set<MyOrder> myOrders = myOrderRepository.findByAccountAndStatus(account, status);
        return myOrderMapper.toDto(myOrders.stream().findFirst().orElse(null));
    }
    
    /**
     * Get one myOrder by MyAccount and OrderStatus.
     *
     * @param MyAccount and OrderStatus
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<MyOrder> findEntityByAccountAndStatus(MyAccount account, OrderStatus status) {
        log.debug("Request to get MyOrder : {}", account, status);
        Set<MyOrder> myOrders = myOrderRepository.findByAccountAndStatus(account, status);
        return myOrders.stream().findFirst();
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
