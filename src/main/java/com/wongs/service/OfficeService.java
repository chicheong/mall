package com.wongs.service;

import com.wongs.domain.Office;
import com.wongs.repository.OfficeRepository;
import com.wongs.repository.search.OfficeSearchRepository;
import com.wongs.service.dto.OfficeDTO;
import com.wongs.service.mapper.OfficeMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Office}.
 */
@Service
@Transactional
public class OfficeService {

    private final Logger log = LoggerFactory.getLogger(OfficeService.class);

    private final OfficeRepository officeRepository;

    private final OfficeMapper officeMapper;

    private final OfficeSearchRepository officeSearchRepository;

    public OfficeService(OfficeRepository officeRepository, OfficeMapper officeMapper, OfficeSearchRepository officeSearchRepository) {
        this.officeRepository = officeRepository;
        this.officeMapper = officeMapper;
        this.officeSearchRepository = officeSearchRepository;
    }

    /**
     * Save a office.
     *
     * @param officeDTO the entity to save.
     * @return the persisted entity.
     */
    public OfficeDTO save(OfficeDTO officeDTO) {
        log.debug("Request to save Office : {}", officeDTO);
        Office office = officeMapper.toEntity(officeDTO);
        office = officeRepository.save(office);
        OfficeDTO result = officeMapper.toDto(office);
        officeSearchRepository.save(office);
        return result;
    }

    /**
     * Get all the offices.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<OfficeDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Offices");
        return officeRepository.findAll(pageable)
            .map(officeMapper::toDto);
    }

    /**
     * Get one office by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<OfficeDTO> findOne(Long id) {
        log.debug("Request to get Office : {}", id);
        return officeRepository.findById(id)
            .map(officeMapper::toDto);
    }

    /**
     * Delete the office by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Office : {}", id);
        officeRepository.deleteById(id);
        officeSearchRepository.deleteById(id);
    }

    /**
     * Search for the office corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<OfficeDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Offices for query {}", query);
        return officeSearchRepository.search(queryStringQuery(query), pageable)
            .map(officeMapper::toDto);
    }
}
