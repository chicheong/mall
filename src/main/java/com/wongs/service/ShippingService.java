package com.wongs.service;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wongs.domain.Shipping;
import com.wongs.repository.ShippingRepository;
import com.wongs.repository.search.ShippingSearchRepository;
import com.wongs.service.dto.ShippingDTO;
import com.wongs.service.mapper.AddressMapper;
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
    private final AddressMapper addressMapper;
    
    private final ShippingRepository shippingRepository;
    private final ShippingSearchRepository shippingSearchRepository;
    
    private final AddressService addressService; 

    public ShippingService(ShippingMapper shippingMapper, MyOrderMapper myOrderMapper, AddressMapper addressMapper, ShippingRepository shippingRepository, ShippingSearchRepository shippingSearchRepository,
    						AddressService addressService) {
    	this.shippingMapper = shippingMapper;
    	this.myOrderMapper = myOrderMapper;
    	this.addressMapper = addressMapper;
    	this.shippingRepository = shippingRepository;
        this.shippingSearchRepository = shippingSearchRepository;
        this.addressService = addressService;
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
     * Create a shipping from MyOrder
     *
     * @param shippingDTO the entity to create
     * @return the persisted entity
     */
//    public ShippingDTO create(MyOrder myOrder) {
//        log.debug("Request to create Shipping from MyOrder : {}", myOrder);
//        ShippingDTO shipping = new ShippingDTO();
//        shipping.setOrder(myOrder);
//        shipping.setCurrency(myOrder.getCurrency());
//        shipping.setStatus(ShippingStatus.PENDING);
//        shipping.setPrice(new BigDecimal(0));
//        AddressDTO shippingAddress = new AddressDTO();
//        shippingAddress = addressService.save(shippingAddress);
//        shipping.setShippingAddress(addressMapper.toEntity(shippingAddress));
//        return this.save(shipping);
//    }

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
    public Optional<ShippingDTO> findOne(Long id) {
        log.debug("Request to get Shipping : {}", id);
        return shippingRepository.findById(id)
            .map(shippingMapper::toDto);
    }

    /**
     * Delete the shipping by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Shipping : {}", id);
        shippingRepository.deleteById(id);
        shippingSearchRepository.deleteById(id);
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
        return shippingSearchRepository.search(queryStringQuery(query), pageable)
            .map(shippingMapper::toDto);
    }
}
