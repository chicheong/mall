package com.wongs.service;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wongs.domain.MyAccount;
import com.wongs.domain.enumeration.OrderStatus;
import com.wongs.repository.MyAccountRepository;
import com.wongs.repository.search.MyAccountSearchRepository;
import com.wongs.service.dto.MyAccountDTO;
import com.wongs.service.mapper.MyAccountMapper;
import com.wongs.service.mapper.MyOrderMapper;
import com.wongs.service.mapper.ShopMapper;

/**
 * Service Implementation for managing MyAccount.
 */
@Service
@Transactional
public class MyAccountService {

    private final Logger log = LoggerFactory.getLogger(MyAccountService.class);

    private final MyAccountMapper myAccountMapper;
    private final ShopMapper shopMapper;
    
    private final MyAccountRepository myAccountRepository;
    private final MyAccountSearchRepository myAccountSearchRepository;
    
    private final MyOrderService myOrderService;
    
    public MyAccountService(MyAccountMapper myAccountMapper, ShopMapper shopMapper, 
    		MyAccountRepository myAccountRepository, MyAccountSearchRepository myAccountSearchRepository,
    		MyOrderService myOrderService) {
        this.myAccountMapper = myAccountMapper;
        this.shopMapper = shopMapper;
    	this.myAccountRepository = myAccountRepository;
        this.myAccountSearchRepository = myAccountSearchRepository;
        this.myOrderService = myOrderService;
    }

    /**
     * Save a myAccount.
     *
     * @param myAccountDTO the entity to save
     * @return the persisted entity
     */
    public MyAccountDTO save(MyAccountDTO myAccountDTO) {
        log.debug("Request to save MyAccount : {}", myAccountDTO);
        MyAccount myAccount = myAccountMapper.toEntity(myAccountDTO);
        myAccount.setUserInfos(myAccountDTO.getUserInfos());
        myAccount.setShops(shopMapper.toEntity(myAccountDTO.getShops()));
        myAccount.setDelegations(myAccountDTO.getDelegations());
        myAccount = myAccountRepository.save(myAccount);
        MyAccountDTO result = myAccountMapper.toDto(myAccount);
        myAccountSearchRepository.save(myAccount);
        return result;
    }

    /**
     * Get all the myAccounts.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<MyAccountDTO> findAll(Pageable pageable) {
        log.debug("Request to get all MyAccounts");
        return myAccountRepository.findAll(pageable)
            .map(myAccountMapper::toDto);
    }

    /**
     * Get one myAccount by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public MyAccountDTO findOne(Long id) {
        log.debug("Request to get MyAccount : {}", id);
        MyAccount myAccount = myAccountRepository.findOneWithEagerRelationships(id);
        MyAccountDTO myAccountDTO = myAccountMapper.toDto(myAccount);
        myAccountDTO.setShops(shopMapper.toDto(myAccount.getShops()));
        myAccountDTO.setMyOrder(myOrderService.findByAccountAndStatus(myAccount, OrderStatus.PENDING));
        myAccountDTO.setDelegations(myAccount.getDelegations());
        return myAccountDTO;
    }
    
    /**
     * Delete the myAccount by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete MyAccount : {}", id);
        myAccountRepository.delete(id);
        myAccountSearchRepository.delete(id);
    }

    /**
     * Search for the myAccount corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<MyAccountDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of MyAccounts for query {}", query);
        Page<MyAccount> result = myAccountSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(myAccountMapper::toDto);
    }
}
