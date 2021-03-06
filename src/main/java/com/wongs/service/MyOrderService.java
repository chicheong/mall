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

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import static org.elasticsearch.index.query.QueryBuilders.*;
import org.springframework.cache.CacheManager;
import com.wongs.domain.MyAccount;
import com.wongs.domain.OrderItem;
import com.wongs.domain.OrderShop;
import com.wongs.domain.ProductItem;
import com.wongs.domain.Shop;
import com.wongs.domain.enumeration.CurrencyType;
import com.wongs.domain.enumeration.OrderStatus;
import com.wongs.repository.MyOrderRepository;
import com.wongs.repository.OrderItemRepository;
import com.wongs.repository.OrderShopRepository;
import com.wongs.repository.search.MyOrderSearchRepository;
import com.wongs.repository.search.OrderItemSearchRepository;
import com.wongs.repository.search.OrderShopSearchRepository;
import com.wongs.service.dto.MyAccountDTO;
import com.wongs.service.dto.OrderItemDTO;
import com.wongs.service.dto.OrderShopDTO;
import com.wongs.service.dto.ProductItemDTO;
import com.wongs.service.mapper.AddressMapper;
import com.wongs.service.mapper.MyAccountMapper;
import com.wongs.service.mapper.OrderItemMapper;
import com.wongs.service.mapper.OrderShopMapper;
import com.wongs.service.mapper.ProductItemMapper;
import com.wongs.service.mapper.ProductStyleMapper;
import com.wongs.service.mapper.UrlMapper;
import com.wongs.web.rest.errors.BadRequestAlertException;

/**
 * Service Implementation for managing {@link MyOrder}.
 */
@Service
@Transactional
public class MyOrderService {

    private final Logger log = LoggerFactory.getLogger(MyOrderService.class);

    private final MyOrderMapper myOrderMapper;
    private final MyAccountMapper myAccountMapper;
    private final AddressMapper addressMapper;
    private final OrderShopMapper orderShopMapper;
    private final OrderItemMapper orderItemMapper;
    private final ProductItemMapper productItemMapper;
    private final ProductStyleMapper productStyleMapper;
    private final UrlMapper urlMapper;

    private final MyOrderRepository myOrderRepository;
    private final MyOrderSearchRepository myOrderSearchRepository;
    
    private final OrderShopRepository orderShopRepository;
    private final OrderShopSearchRepository orderShopSearchRepository;
    
    private final OrderItemRepository orderItemRepository;
    private final OrderItemSearchRepository orderItemSearchRepository;
    
    private final CacheManager cacheManager;
    
    private final ShippingService shippingService;
    private final PaymentService paymentService;
    private final AddressService addressService;
    private final ShopService shopService;
    private final UrlService urlService;

    public MyOrderService(MyOrderMapper myOrderMapper, MyAccountMapper myAccountMapper, AddressMapper addressMapper,
    						OrderShopMapper orderShopMapper, OrderItemMapper orderItemMapper, ProductItemMapper productItemMapper,
    						ProductStyleMapper productStyleMapper, UrlMapper urlMapper,
    						MyOrderRepository myOrderRepository, MyOrderSearchRepository myOrderSearchRepository,
    						OrderShopRepository orderShopRepository, OrderShopSearchRepository orderShopSearchRepository,
    						OrderItemRepository orderItemRepository, OrderItemSearchRepository orderItemSearchRepository,
    						CacheManager cacheManager,
    						ShippingService shippingService, PaymentService paymentService, AddressService addressService,
    						ShopService shopService, UrlService urlService) {
        this.myOrderMapper = myOrderMapper;
        this.myAccountMapper = myAccountMapper;
        this.addressMapper = addressMapper;
        this.orderShopMapper = orderShopMapper;
        this.orderItemMapper = orderItemMapper;
        this.productStyleMapper = productStyleMapper;
        this.productItemMapper = productItemMapper;
        this.urlMapper = urlMapper;
    	this.myOrderRepository = myOrderRepository;
        this.myOrderSearchRepository = myOrderSearchRepository;
        this.orderShopRepository = orderShopRepository;
        this.orderShopSearchRepository = orderShopSearchRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderItemSearchRepository = orderItemSearchRepository;
        this.cacheManager = cacheManager;
        this.shippingService = shippingService;
        this.paymentService = paymentService;
        this.addressService = addressService;
        this.shopService = shopService;
        this.urlService = urlService;
    }

    /**
     * Save a myOrder.
     *
     * @param myOrderDTO the entity to save.
     * @return the persisted entity.
     */
    public MyOrderDTO save(MyOrderDTO myOrderDTO) {
        log.debug("Request to save MyOrder : {}", myOrderDTO);
        MyOrder myOrder = myOrderMapper.toEntity(myOrderDTO);
        myOrder.setShops(orderShopMapper.toEntity(myOrderDTO.getShops()));
        myOrder.setStatusHistories(myOrderDTO.getStatusHistories());
        MyOrder result = myOrderRepository.save(myOrder);
//        MyOrderDTO result = myOrderMapper.toDto(myOrder);
        myOrderSearchRepository.save(myOrder);
        myOrderDTO.getShops().forEach((shop) -> {
        	OrderShop orderShop = orderShopMapper.toEntity(shop);
        	orderShop.setOrder(result);
        	orderShop = orderShopRepository.save(orderShop);
        	orderShopSearchRepository.save(orderShop);
        	shop.getItems().forEach((item) -> {
        		OrderItem orderItem = orderItemMapper.toEntity(item);
//        		orderItem.setShop(orderShop);
        		orderItemRepository.save(orderItem);
        		orderItemSearchRepository.save(orderItem);
        	});
        });
        
//      Optional.ofNullable(myOrderDTO.getShipping()).ifPresent(shippingDTO -> {
//      	Optional.ofNullable(shippingDTO.getShippingAddress()).ifPresent(address -> {
//      		if (address.getId() == null) {
//      			shippingDTO.setShippingAddress(addressService.save(address));
//      		} else {
//      			AddressDTO oAddressDTO = addressService.findOne(address.getId());
//      			AddressDTO nAddressDTO = addressMapper.toDto(address);
//      			if (!(oAddressDTO.equals(nAddressDTO))) {
//      				shippingDTO.setShippingAddress(addressService.save(address));
//      			}
//      		}
//      	});
//      	shippingDTO.setOrder(result);
//      	shippingService.save(shippingDTO);
//      });
      Optional.ofNullable(myOrderDTO.getPayment()).ifPresent(paymentDTO -> {
    	  paymentDTO.setOrder(result);
    	  paymentService.save(paymentDTO);
      });
//      return this.findOne(myOrder.getId());
      return myOrderMapper.toDto(myOrder);
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
        	return this.createOrderWithCurrencyAndOrderStatus(myAccount, orderItem.getCurrency(), OrderStatus.PENDING);	
        });
        Shop shop = shopService.findByProductItem(orderItem.getProductItem());
        myOrder.getShops().stream().filter(orderShop -> shop.getId().equals(orderShop.getShop().getId())).findFirst().map(orderShop -> {
        	orderShop.getItems().stream().filter(item -> orderItem.getProductItem().getId().equals(item.getProductItem().getId())).findFirst().map(item -> {
            	item.setQuantity(item.getQuantity() + orderItem.getQuantity());
            	orderItemRepository.save(item);
            	orderShop.setTotal(this.calculateTotalPrice(orderShop));
            	orderShopRepository.save(orderShop);
            	orderShopSearchRepository.save(orderShop);
            	return item; 
        	}).orElseGet(() -> {
            	orderItem.setShop(orderShop);
            	OrderItem nOrderItem = orderItemRepository.save(orderItem);
            	orderShop.getItems().add(nOrderItem);
            	orderShop.setTotal(this.calculateTotalPrice(orderShop));
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
        return this.findOne(myOrder.getId()).orElse(null);
    }
    
    /**
     * Check if a MyOrder with OrderStatus Checkout is changed.
     *
     * @param myOrderDTO the entity to check
     */
    public void checkOrderUpdated(MyAccountDTO myAccountDTO, MyOrderDTO myOrderDTO) {
        if (!OrderStatus.CHECKOUT.equals(myOrderDTO.getStatus()))
        	throw new BadRequestAlertException("Your order has wrong status.", "MyOrder", "wrongstatus");
        
        MyAccount myAccount = myAccountMapper.toEntity(myAccountDTO);
        MyOrder myOrder = this.findEntityByAccountAndStatus(myAccount, OrderStatus.CHECKOUT).get();
        MyOrder nMyOrder = myOrderMapper.toEntity(myOrderDTO);
        myOrderDTO.getShops().forEach((shop) -> {
        	OrderShop orderShop = orderShopMapper.toEntity(shop);
        	shop.getItems().forEach((item) -> {
        		orderShop.getItems().add(orderItemMapper.toEntity(item));
        	});
        	nMyOrder.getShops().add(orderShop);
        });
        if (!myOrder.equals(nMyOrder)) {
        	throw new BadRequestAlertException("Your order has been changed. Please update it.", "MyOrder", "mallApp.myOrder.cart.pending.itemChosen");
        }
    }
    
    /**
     * Add or replace a MyOrder with OrderStatus Checkout.
     *
     * @param myOrderDTO the entity to save
     * @return the persisted entity
     */
    public void checkout(MyAccountDTO myAccountDTO, MyOrderDTO myOrderDTO) {
    	log.debug("Request to add or replace MyOrder : {} ", myOrderDTO);
        MyAccount myAccount = myAccountMapper.toEntity(myAccountDTO);
        MyOrder myOrder = this.findEntityByAccountAndStatus(myAccount, OrderStatus.CHECKOUT).orElseGet(() -> {
        	return this.createOrderWithCurrencyAndOrderStatus(myAccount, myOrderDTO.getCurrency(), OrderStatus.CHECKOUT);	
        });
        myOrder.getShops().forEach((shop) -> {
        	shop.getItems().forEach((item) -> {
        		orderItemRepository.delete(item);
        	});
        	orderShopRepository.delete(shop);
        });
        myOrder.setTotal(myOrderDTO.getTotal());
        myOrder.setCurrency(myOrderDTO.getCurrency());
        myOrder.setShops(new HashSet<>());
        MyOrder result = myOrderRepository.save(myOrder);
        myOrderSearchRepository.save(myOrder);
        for (OrderShopDTO shop : myOrderDTO.getShops()) {
        	OrderShop orderShop = orderShopMapper.toEntity(shop);
        	orderShop.setId(0L);
        	orderShop.setOrder(result);
        	orderShop.setTotal(this.calculateTotalPrice(orderShop));
        	OrderShop nOrderShop = orderShopRepository.save(orderShop);
        	orderShopSearchRepository.save(orderShop);
        	shop.getItems().forEach((item) -> {
        		OrderItem orderItem = orderItemMapper.toEntity(item);
        		orderItem.setId(0L);
        		orderItem.setShop(nOrderShop);
        		orderItemRepository.save(orderItem);
        		orderItemSearchRepository.save(orderItem);
        	});
        }
    }

    private MyOrder createOrderWithCurrencyAndOrderStatus(MyAccount myAccount, CurrencyType currency, OrderStatus orderStatus) {
    	MyOrder myOrder = new MyOrder();
    	myOrder.setAccount(myAccount);
    	myOrder.setCurrency(currency);
    	myOrder.setStatus(orderStatus);
        myOrder = myOrderRepository.save(myOrder);
        myOrderSearchRepository.save(myOrder);
        
//        shippingService.create(myOrder);
        paymentService.create(myOrder);
        
    	return myOrder;
    }

    /**
     * Get all the myOrders.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
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
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<MyOrderDTO> findOne(Long id) {
        log.debug("Request to get MyOrder : {}", id);
        return myOrderRepository.findById(id)
            .map(myOrder -> {
            	return this.toDTOWithDetail(myOrder);
            });
//        myOrderMapper::toDto
    }

    @Transactional(readOnly = true)
    public MyOrderDTO findByAccountAndStatus(MyAccountDTO account, OrderStatus status) {
    	return this.findByAccountAndStatus(myAccountMapper.toEntity(account), status);
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
        return this.toDTOWithDetail(myOrder);
    }
    
    private MyOrderDTO toDTOWithDetail(MyOrder myOrder){
        if (myOrder == null)
        	return null;
        
        MyOrderDTO myOrderDTO = myOrderMapper.toDto(myOrder);
        myOrder.getShops().forEach((shop) -> {
        	OrderShopDTO shopDTO = orderShopMapper.toDto(shop);
        	shop.getItems().forEach((item) -> {
        		OrderItemDTO itemDTO = orderItemMapper.toDto(item);
        		ProductItemDTO productItemDTO = productItemMapper.toDto(item.getProductItem());
	        	productItemDTO.setColor(productStyleMapper.toDto(item.getProductItem().getColor()));
	        	productItemDTO.setSize(productStyleMapper.toDto(item.getProductItem().getSize()));
        		//TODO: ProductItemUrl -> ProductUrl
        		productItemDTO.setUrl(urlMapper.toDto(urlService.findOneByEntityTypeAndEntityId(ProductItem.class.getSimpleName(), productItemDTO.getId())));
        		itemDTO.setProductItem(productItemDTO);
        		shopDTO.getItems().add(itemDTO);
        	});
        	myOrderDTO.getShops().add(shopDTO);
        });
        myOrder.getStatusHistories().forEach((statusHistory) -> {
        	myOrderDTO.getStatusHistories().add(statusHistory);
        });
        myOrderDTO.setPayment(paymentService.findByOrder(myOrder));
        return myOrderDTO;
    }
    
    public BigDecimal calculateTotalPrice(OrderItem orderItem) {
    	return orderItem.getPrice().multiply(new BigDecimal(orderItem.getQuantity()));
    }
    
    public BigDecimal calculateTotalPrice(OrderShop orderShop) {
    	BigDecimal total = new BigDecimal(0);
    	for (OrderItem item : orderShop.getItems()) {
    		total = total.add(calculateTotalPrice(item));
    	}
    	return total;
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
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete MyOrder : {}", id);
        myOrderRepository.deleteById(id);
        myOrderSearchRepository.deleteById(id);
    }
    
    /**
     * Delete the orderItem by id.
     *
     * @param id the id of the entity
     */
    public void deleteOrderItem(Long orderItemId) {
        log.debug("Request to delete OrderItem : {}", orderItemId);
        
        MyOrder myOrder = orderItemRepository.findById(orderItemId).get().getShop().getOrder();
        myOrder.getShops().stream().forEach(orderShop -> {
//        	orderShop.getItems().stream().filter((orderItem) -> orderItem.getId().equals(orderItemId)).map((orderItem) -> {
//                orderItemRepository.deleteById(orderItem.getId());
//                orderItemSearchRepository.deleteById(orderItem.getId());
//        		return orderItem;
//        	});
        	orderShop.getItems().forEach((orderItem) -> {
        		if (orderItem.getId().equals(orderItemId)) {
        			orderItemRepository.deleteById(orderItem.getId());
        			orderItemSearchRepository.deleteById(orderItem.getId());
        			orderShopRepository.save(orderShop);
        		}
        	});
        });
        myOrder = myOrderRepository.save(myOrder);
        myOrderSearchRepository.save(myOrder);
//        myOrder.getShops().stream().filter((orderShop) -> orderShop.getItems().isEmpty()).map(shop -> {
//    		orderShopRepository.deleteById(shop.getId());
//    		orderShopSearchRepository.deleteById(shop.getId());
//    		return shop;
//        });

//        Long myOrderId = orderItemRepository.findById(orderItemId).get().getShop().getOrder().getId();
//        Long orderShopId = orderItemRepository.findById(orderItemId).get().getShop().getId();
//        orderItemRepository.deleteById(orderItemId);
//        orderItemSearchRepository.deleteById(orderItemId);
//        this.clearMyOrderCaches(myOrder.getId());
//        this.clearOrderShopCaches(orderShopId);
//        this.clearOrderItemCaches(orderItemId);
    }
    
    /**
     * Delete the orderItem by id.
     *
     * @param id the id of the entity
     */
    public void removeEmptyOrderShop(Long myOrderId) {
        log.debug("Request to remove all empty OrderShop from MyOrder : {}", myOrderId);
        this.clearMyOrderCaches(myOrderId);
        MyOrder myOrder = myOrderRepository.findById(myOrderId).get();
        myOrder.getShops().stream().filter((shop) -> shop.getItems().isEmpty()).map(shop -> {
    		orderShopRepository.deleteById(shop.getId());
    		orderShopSearchRepository.deleteById(shop.getId());
    		return shop;
        });
    }

    /**
     * Search for the myOrder corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<MyOrderDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of MyOrders for query {}", query);
        return myOrderSearchRepository.search(queryStringQuery(query), pageable)
            .map(myOrderMapper::toDto);
    }
    
    private void clearMyOrderCaches(Long id) {
        Objects.requireNonNull(cacheManager.getCache(com.wongs.domain.MyOrder.class.getName())).evict(id);
    }
    
    private void clearOrderShopCaches(Long orderShopId) {
        Objects.requireNonNull(cacheManager.getCache(com.wongs.domain.OrderShop.class.getName())).evict(orderShopId);
    }
    
    private void clearOrderItemCaches(Long orderItemId) {
        Objects.requireNonNull(cacheManager.getCache(com.wongs.domain.OrderItem.class.getName())).evict(orderItemId);
    }
}
