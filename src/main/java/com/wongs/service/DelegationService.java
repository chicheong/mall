package com.wongs.service;

import com.wongs.domain.Delegation;
import com.wongs.repository.DelegationRepository;
import com.wongs.repository.search.DelegationSearchRepository;
import com.wongs.service.dto.DelegationDTO;
import com.wongs.service.mapper.DelegationMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Delegation.
 */
@Service
@Transactional
public class DelegationService {

    private final Logger log = LoggerFactory.getLogger(DelegationService.class);

    private final DelegationRepository delegationRepository;

    private final DelegationMapper delegationMapper;

    private final DelegationSearchRepository delegationSearchRepository;

    public DelegationService(DelegationRepository delegationRepository, DelegationMapper delegationMapper, DelegationSearchRepository delegationSearchRepository) {
        this.delegationRepository = delegationRepository;
        this.delegationMapper = delegationMapper;
        this.delegationSearchRepository = delegationSearchRepository;
    }

    /**
     * Save a delegation.
     *
     * @param delegationDTO the entity to save
     * @return the persisted entity
     */
    public DelegationDTO save(DelegationDTO delegationDTO) {
        log.debug("Request to save Delegation : {}", delegationDTO);
        Delegation delegation = delegationMapper.toEntity(delegationDTO);
        delegation = delegationRepository.save(delegation);
        DelegationDTO result = delegationMapper.toDto(delegation);
        delegationSearchRepository.save(delegation);
        return result;
    }

    /**
     * Get all the delegations.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<DelegationDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Delegations");
        return delegationRepository.findAll(pageable)
            .map(delegationMapper::toDto);
    }


    /**
     * Get one delegation by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<DelegationDTO> findOne(Long id) {
        log.debug("Request to get Delegation : {}", id);
        return delegationRepository.findById(id)
            .map(delegationMapper::toDto);
    }

    /**
     * Delete the delegation by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Delegation : {}", id);
        delegationRepository.deleteById(id);
        delegationSearchRepository.deleteById(id);
    }

    /**
     * Search for the delegation corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<DelegationDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Delegations for query {}", query);
        return delegationSearchRepository.search(queryStringQuery(query), pageable)
            .map(delegationMapper::toDto);
    }
}
