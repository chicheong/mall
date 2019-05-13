package com.wongs.service;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wongs.domain.MyAccount;
import com.wongs.domain.MyOrder;
import com.wongs.domain.OrderItem;
import com.wongs.domain.OrderShop;
import com.wongs.domain.Shop;
import com.wongs.domain.enumeration.CurrencyType;
import com.wongs.domain.enumeration.OrderStatus;
import com.wongs.repository.MyOrderRepository;
import com.wongs.repository.OrderItemRepository;
import com.wongs.repository.OrderShopRepository;
import com.wongs.repository.search.MyOrderSearchRepository;
import com.wongs.repository.search.OrderItemSearchRepository;
import com.wongs.repository.search.OrderShopSearchRepository;
import com.wongs.service.dto.AddressDTO;
import com.wongs.service.dto.MyAccountDTO;
import com.wongs.service.dto.MyOrderDTO;
import com.wongs.service.mapper.AddressMapper;
import com.wongs.service.mapper.MyAccountMapper;
import com.wongs.service.mapper.MyOrderMapper;

/**
 * Service Implementation for managing MyOrder.
 */
@Service
@Transactional
public class MyOrderService {

    private final Logger log = LoggerFactory.getLogger(MyOrderService.class);

    private final MyOrderMapper myOrderMapper;
    private final MyAccountMapper myAccountMapper;
    private final AddressMapper addressMapper;

    private final MyOrderRepository myOrderRepository;
    private final MyOrderSearchRepository myOrderSearchRepository;
    
    private final OrderShopRepository orderShopRepository;
    private final OrderShopSearchRepository orderShopSearchRepository;
    
    private final OrderItemRepository orderItemRepository;
    private final OrderItemSearchRepository orderItemSearchRepository;
    
    private final ShippingService shippingService;
    private final PaymentService paymentService;
    private final AddressService addressService;
    private final ShopService shopService;

    public MyOrderService(MyOrderMapper myOrderMapper, MyAccountMapper myAccountMapper, AddressMapper addressMapper,
    						MyOrderRepository myOrderRepository, MyOrderSearchRepository myOrderSearchRepository,
    						OrderShopRepository orderShopRepository, OrderShopSearchRepository orderShopSearchRepository,
    						OrderItemRepository orderItemRepository, OrderItemSearchRepository orderItemSearchRepository,
    						ShippingService shippingService, PaymentService paymentService, AddressService addressService,
    						ShopService shopService) {
        this.myOrderMapper = myOrderMapper;
        this.myAccountMapper = myAccountMapper;
        this.addressMapper = addressMapper;
    	this.myOrderRepository = myOrderRepository;
        this.myOrderSearchRepository = myOrderSearchRepository;
        this.orderShopRepository = orderShopRepository;
        this.orderShopSearchRepository = orderShopSearchRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderItemSearchRepository = orderItemSearchRepository;
        this.shippingService = shippingService;
        this.paymentService = paymentService;
        this.addressService = addressService;
        this.shopService = shopService;
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
        myOrder.setShops(myOrderDTO.getShops());
        myOrder.setStatusHistories(myOrderDTO.getStatusHistories());
        MyOrder result = myOrderRepository.save(myOrder);
//        MyOrderDTO result = myOrderMapper.toDto(myOrder);
        myOrderSearchRepository.save(myOrder);
        myOrderDTO.getShops().forEach((shop) -> {
        	orderShopRepository.save(shop);
        	orderShopSearchRepository.save(shop);
        });
//        Optional.ofNullable(myOrderDTO.getShipping()).ifPresent(shippingDTO -> {
//        	Optional.ofNullable(shippingDTO.getShippingAddress()).ifPresent(address -> {
//        		if (address.getId() == null) {
//        			shippingDTO.setShippingAddress(addressService.save(address));
//        		} else {
//        			AddressDTO oAddressDTO = addressService.findOne(address.getId());
//        			AddressDTO nAddressDTO = addressMapper.toDto(address);
//        			if (!(oAddressDTO.equals(nAddressDTO))) {
//        				shippingDTO.setShippingAddress(addressService.save(address));
//        			}
//        		}
//        	});
//        	shippingDTO.setOrder(result);
//        	shippingService.save(shippingDTO);
//        });
        Optional.ofNullable(myOrderDTO.getPayment()).ifPresent(paymentDTO -> {
        	paymentDTO.setOrder(result);
        	paymentService.save(paymentDTO);
        });
        return this.findOne(myOrder.getId());
    }
    
    /**
     * Add a productItem to a Pending MyOrder.
     *
     * @param myOrderDTO the entity to save
     * @return the persisted entity
     */
    public MyOrderDTO addToCart(MyAccountDTO myAccountDTO, final OrderItem orderItem) {
        log.debug("Request to add OrderItem : {} ", orderItem);
        MyAccount myAccount = myAccountMapper.toEntity(myAccountDTO);
        MyOrder myOrder = this.findEntityByAccountAndStatus(myAccount, OrderStatus.PENDING).orElseGet(() -> {
        	return this.createPendingOrder(myAccount, orderItem.getCurrency());	
        });
        Shop shop = shopService.findByProductItem(orderItem.getProductItem());
        myOrder.getShops().stream().filter(orderShop -> shop.getId().equals(orderShop.getId())).findFirst().map(orderShop -> {
        	orderShop.getItems().stream().filter(item -> orderItem.getProductItem().equals(item.getProductItem())).findFirst().map(item -> {
            	item.setQuantity(item.getQuantity() + orderItem.getQuantity());
            	orderItemRepository.save(item);
            	return item; 
        	}).orElseGet(() -> {
            	orderItem.setShop(orderShop);
            	orderItemRepository.save(orderItem);
            	orderShop.getItems().add(orderItem);
            	orderShopRepository.save(orderShop);
            	orderShopSearchRepository.save(orderShop);
            	return orderItem;
            });
        	return orderShop;
        }).orElseGet(() -> {
        	OrderShop orderShop = new OrderShop();
        	orderShop.setOrder(myOrder);
        	orderShop.setShop(shop);
        	orderShop.getItems().add(orderItem);
        	orderShop.setCurrency(orderItem.getCurrency());
        	orderShop.setTotal(this.calculateTotalPrice(orderItem));
        	orderShop = orderShopRepository.save(orderShop);
        	orderShopSearchRepository.save(orderShop);
        	orderItem.setShop(orderShop);
        	orderItemRepository.save(orderItem);
        	return orderShop;
        });
        
//        myOrder.getItems().stream().filter(item -> orderItem.getProductItem().equals(item.getProductItem())).findFirst().map(item -> {
//        	item.setQuantity(item.getQuantity() + orderItem.getQuantity());
//        	orderItemRepository.save(item);
//        	return item; 
//        }).orElseGet(() -> {
//        	orderItem.setOrder(myOrder);
//        	orderItemRepository.save(orderItem);
//        	myOrder.getItems().add(orderItem);
//            myOrderRepository.save(myOrder);
//            myOrderSearchRepository.save(myOrder);     
//        	return orderItem;
//        });
//        boolean itemFound = false;
//        for (OrderItem item : myOrder.getItems()){
//        	if (orderItem.getProductItem().equals(item.getProductItem())) {
//        		item.setQuantity(item.getQuantity() + orderItem.getQuantity());
//            	orderItemRepository.save(item);
//        		itemFound = true;
//        		break;
//        	}
//        }
//        if (!itemFound){
//        	orderItem.setOrder(myOrder);
//        	orderItemRepository.save(orderItem);
//        	myOrder.getItems().add(orderItem);
//        	myOrderRepository.save(myOrder);
//        	myOrderSearchRepository.save(myOrder); 
//        }
        return this.findOne(myOrder.getId());
    }

    private MyOrder createPendingOrder(MyAccount myAccount, CurrencyType currency) {
    	MyOrder myOrder = new MyOrder();
    	myOrder.setAccount(myAccount);
    	myOrder.setCurrency(currency);
    	myOrder.setStatus(OrderStatus.PENDING);
        myOrder = myOrderRepository.save(myOrder);
        myOrderSearchRepository.save(myOrder);
        
//        shippingService.create(myOrder);
        paymentService.create(myOrder);
        
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
        return this.toDTOWithDetail(myOrder);
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
        MyOrder myOrder = myOrders.stream().findFirst().orElse(null);
        myOrder.getShops().forEach((shop) -> {
        	shop.getItems().forEach((item) -> {
        		log.error("item.getPrice(): " + item.getPrice());
        		Hibernate.initialize(item);
        	});
        	Hibernate.initialize(shop.getItems());
        });
        return this.toDTOWithDetail(myOrder);
    }
    
    private MyOrderDTO toDTOWithDetail(MyOrder myOrder){
        if (myOrder == null)
        	return null;
        
        MyOrderDTO myOrderDTO = myOrderMapper.toDto(myOrder);
        myOrderDTO.getShops().forEach((shop) -> {
        	shop.getItems().forEach((item) -> {
        		log.error("item: " + item);
        	});
        	log.error("shop.getItems().size(): " + shop.getItems().size());
        });
        myOrder.getStatusHistories().forEach((statusHistory) -> {
        	myOrderDTO.getStatusHistories().add(statusHistory);
        });
        
//        myOrderDTO.setShipping(shippingService.findByOrder(myOrder));
        myOrderDTO.setPayment(paymentService.findByOrder(myOrder));
        return myOrderDTO;
    }
    
    public BigDecimal calculateTotalPrice(OrderItem orderItem) {
    	return orderItem.getPrice().multiply(new BigDecimal(orderItem.getQuantity()));
    }
    
    /**
     * Get one myOrder by MyAccount and OrderStatus.
     *
     * @param MyAccount and OrderStatus
     * @return the entity
     */
    @Transactional(readOnly = true)
    private Optional<MyOrder> findEntityByAccountAndStatus(MyAccount account, OrderStatus status) {
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
