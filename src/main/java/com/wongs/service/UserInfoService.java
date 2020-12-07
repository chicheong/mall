package com.wongs.service;

import com.wongs.domain.UserInfo;
import com.wongs.repository.UserInfoRepository;
import com.wongs.repository.search.UserInfoSearchRepository;
import com.wongs.service.dto.UserInfoDTO;
import com.wongs.service.mapper.MyAccountMapper;
import com.wongs.service.mapper.UserInfoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link UserInfo}.
 */
@Service
@Transactional
public class UserInfoService {

    private final Logger log = LoggerFactory.getLogger(UserInfoService.class);

    private final UserInfoMapper userInfoMapper;
    private final MyAccountMapper myAccountMapper;
    
    private final UserInfoRepository userInfoRepository;
    private final UserInfoSearchRepository userInfoSearchRepository;

    public UserInfoService(UserInfoMapper userInfoMapper, MyAccountMapper myAccountMapper,
    		UserInfoRepository userInfoRepository, UserInfoSearchRepository userInfoSearchRepository
    		) {
        this.userInfoMapper = userInfoMapper;
        this.myAccountMapper = myAccountMapper;
        this.userInfoRepository = userInfoRepository;
        this.userInfoSearchRepository = userInfoSearchRepository;
    }

    /**
     * Save a userInfo.
     *
     * @param userInfoDTO the entity to save.
     * @return the persisted entity.
     */
    public UserInfoDTO save(UserInfoDTO userInfoDTO) {
        log.debug("Request to save UserInfo : {}", userInfoDTO);
        UserInfo userInfo = userInfoMapper.toEntity(userInfoDTO);
        userInfo.setAccounts(myAccountMapper.toEntity(userInfoDTO.getAccounts()));
        userInfo = userInfoRepository.save(userInfo);
        UserInfoDTO result = userInfoMapper.toDto(userInfo);
        userInfoSearchRepository.save(userInfo);
        return result;
    }

    /**
     * Get all the userInfos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<UserInfoDTO> findAll(Pageable pageable) {
        log.debug("Request to get all UserInfos");
        return userInfoRepository.findAll(pageable)
            .map(userInfoMapper::toDto);
    }

    /**
     * Get all the userInfos with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<UserInfoDTO> findAllWithEagerRelationships(Pageable pageable) {
        return userInfoRepository.findAllWithEagerRelationships(pageable).map(userInfoMapper::toDto);
    }

    /**
     * Get one userInfo by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UserInfoDTO> findOne(Long id) {
        log.debug("Request to get UserInfo : {}", id);
        return userInfoRepository.findOneWithEagerRelationships(id)
            .map(userInfoMapper::toDto);
    }

    @Transactional(readOnly = true)
    public UserInfoDTO findOneWithAccountsByUserLogin(String login) {
    	UserInfo userInfo = userInfoRepository.findOneWithAccountsByUserLogin(login);
    	if (userInfo == null)
    		return null;
    	UserInfoDTO userInfoDTO = userInfoMapper.toDto(userInfo);
    	userInfoDTO.setAccounts(myAccountMapper.toDto(userInfo.getAccounts()));
        return userInfoDTO;
    }
    
    /**
     * Delete the userInfo by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete UserInfo : {}", id);
        userInfoRepository.deleteById(id);
        userInfoSearchRepository.deleteById(id);
    }

    /**
     * Search for the userInfo corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<UserInfoDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of UserInfos for query {}", query);
        return userInfoSearchRepository.search(queryStringQuery(query), pageable)
            .map(userInfoMapper::toDto);
    }
}
