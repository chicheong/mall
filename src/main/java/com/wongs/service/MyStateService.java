package com.wongs.service;

import com.wongs.domain.MyState;
import com.wongs.repository.MyStateRepository;
import com.wongs.repository.search.MyStateSearchRepository;
import com.wongs.service.dto.MyStateDTO;
import com.wongs.service.mapper.MyStateMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link MyState}.
 */
@Service
@Transactional
public class MyStateService {

    private final Logger log = LoggerFactory.getLogger(MyStateService.class);

    private final MyStateRepository myStateRepository;

    private final MyStateMapper myStateMapper;

    private final MyStateSearchRepository myStateSearchRepository;

    public MyStateService(MyStateRepository myStateRepository, MyStateMapper myStateMapper, MyStateSearchRepository myStateSearchRepository) {
        this.myStateRepository = myStateRepository;
        this.myStateMapper = myStateMapper;
        this.myStateSearchRepository = myStateSearchRepository;
    }

    /**
     * Save a myState.
     *
     * @param myStateDTO the entity to save.
     * @return the persisted entity.
     */
    public MyStateDTO save(MyStateDTO myStateDTO) {
        log.debug("Request to save MyState : {}", myStateDTO);
        MyState myState = myStateMapper.toEntity(myStateDTO);
        myState = myStateRepository.save(myState);
        MyStateDTO result = myStateMapper.toDto(myState);
        myStateSearchRepository.save(myState);
        return result;
    }

    /**
     * Get all the myStates.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<MyStateDTO> findAll(Pageable pageable) {
        log.debug("Request to get all MyStates");
        return myStateRepository.findAll(pageable)
            .map(myStateMapper::toDto);
    }

    /**
     * Get one myState by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<MyStateDTO> findOne(Long id) {
        log.debug("Request to get MyState : {}", id);
        return myStateRepository.findById(id)
            .map(myStateMapper::toDto);
    }

    /**
     * Delete the myState by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete MyState : {}", id);
        myStateRepository.deleteById(id);
        myStateSearchRepository.deleteById(id);
    }

    /**
     * Search for the myState corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<MyStateDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of MyStates for query {}", query);
        return myStateSearchRepository.search(queryStringQuery(query), pageable)
            .map(myStateMapper::toDto);
    }
}
