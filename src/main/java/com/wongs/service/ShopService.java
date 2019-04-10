package com.wongs.service;

import com.wongs.domain.MyAccount;
import com.wongs.domain.Shop;
import com.wongs.domain.User;
import com.wongs.domain.enumeration.CommonStatus;
import com.wongs.domain.enumeration.DelegationType;
import com.wongs.permission.PermissionsConstants;
import com.wongs.repository.MyAccountRepository;
import com.wongs.repository.ShopRepository;
import com.wongs.repository.search.ShopSearchRepository;
import com.wongs.security.AuthoritiesConstants;
import com.wongs.security.SecurityUtils;
import com.wongs.service.dto.MyAccountDTO;
import com.wongs.service.dto.ShopDTO;
import com.wongs.service.dto.UserInfoDTO;
import com.wongs.service.mapper.ShopMapper;
import com.wongs.service.util.DateUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.elasticsearch.index.query.QueryBuilders.*;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Service Implementation for managing Shop.
 */
@Service
@Transactional
public class ShopService {

    private final Logger log = LoggerFactory.getLogger(ShopService.class);

    private final ShopMapper shopMapper;
    
    private final ShopRepository shopRepository;
    private final ShopSearchRepository shopSearchRepository;
    
    private final UserInfoService userInfoService;
    private final MyAccountService myAccountService;
    private final DelegationService delegationService;

    public ShopService(ShopMapper shopMapper, ShopRepository shopRepository, ShopSearchRepository shopSearchRepository, 
    					UserInfoService userInfoService, MyAccountService myAccountService, 
    					DelegationService delegationService) {
        this.shopMapper = shopMapper;
    	this.shopRepository = shopRepository;
        this.shopSearchRepository = shopSearchRepository;
        this.userInfoService = userInfoService;
        this.myAccountService = myAccountService;
        this.delegationService = delegationService;
    }

    /**
     * Save a shop.
     *
     * @param shopDTO the entity to save
     * @return the persisted entity
     */
    public ShopDTO save(ShopDTO shopDTO) {
        log.debug("Request to save Shop : {}", shopDTO);
        Shop shop = shopMapper.toEntity(shopDTO);
        shop.setAccounts(shopDTO.getAccounts());
        shop = shopRepository.save(shop);
        ShopDTO result = shopMapper.toDto(shop);
        shopSearchRepository.save(shop);
        return result;
    }

    /**
     * Get all the shops.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<ShopDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Shops");
        return shopRepository.findAll(pageable)
            .map(shopMapper::toDto);
    }

    /**
     * Get one shop by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public ShopDTO findOne(Long id) {
        log.debug("Request to get Shop : {}", id);
        Shop shop = shopRepository.findOne(id);
        
        ShopDTO shopDTO = shopMapper.toDto(shop);
        return shopDTO;
    }
    
    /**
     * Get one shop by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Shop getOne(Long id) {
        log.debug("Request to get Shop : {}", id);
        return shopRepository.findOne(id);
    }

    /**
     * Get one shop by code.
     *
     * @param code the code of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public ShopDTO findByCode(String code) {
        log.debug("Request to get Shop : {}", code);
        Shop shop = shopRepository.findByCode(code);
        ShopDTO shopDTO = shopMapper.toDto(shop);
        return shopDTO;
    }
    
    /**
     * Delete the shop by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Shop : {}", id);
        shopRepository.delete(id);
        shopSearchRepository.delete(id);
    }

    /**
     * Search for the shop corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<ShopDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Shops for query {}", query);
        Page<Shop> result = shopSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(shopMapper::toDto);
    }
    
    
    /**
     * @param shopId
     * @param accountId
     * @return permission code
     */
    public String getPermission(Long shopId) {
    	// Admin has all rights
    	if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN))
    		return PermissionsConstants.ALL;
    	
    	Shop shop = shopRepository.findOne(shopId);
    	
    	// Check if current account is in-charge account and assign all rights
    	if (SecurityUtils.isAuthenticated()) {
    		String login = SecurityUtils.getCurrentUserLogin().get();
    		UserInfoDTO userInfo = userInfoService.findOneWithAccountsByUserLogin(login);
    		
    		MyAccountDTO myAccount = myAccountService.findOne(userInfo.getAccountId());
        	for (MyAccount inChargeAccount : shop.getAccounts()) {
        		if (inChargeAccount.getId().equals(myAccount.getId()) || 
        				myAccount.getDelegations().stream()
        					.filter(delegation -> DelegationType.ACCOUNT.equals(delegation.getType()))
        					.filter(delegation -> DateUtil.withinRange(ZonedDateTime.now(ZoneId.systemDefault()), delegation.getFrom(), delegation.getTo()))
        					.anyMatch(delegation -> Long.valueOf(delegation.getDelegateId()).equals(inChargeAccount.getId()))) {
        			return PermissionsConstants.ALL;
        		}
        	}
    	}
    	// if user is not logged in or do not have corresponding right
    	if (shop.getStatus().equals(CommonStatus.INACTIVE))
    		return null;
    	else
    		return PermissionsConstants.READ;
    }
}
