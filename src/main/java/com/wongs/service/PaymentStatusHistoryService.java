package com.wongs.service;

import com.wongs.domain.PaymentStatusHistory;
import com.wongs.repository.PaymentStatusHistoryRepository;
import com.wongs.repository.search.PaymentStatusHistorySearchRepository;
import com.wongs.service.dto.PaymentStatusHistoryDTO;
import com.wongs.service.mapper.PaymentStatusHistoryMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link PaymentStatusHistory}.
 */
@Service
@Transactional
public class PaymentStatusHistoryService {

    private final Logger log = LoggerFactory.getLogger(PaymentStatusHistoryService.class);

    private final PaymentStatusHistoryRepository paymentStatusHistoryRepository;

    private final PaymentStatusHistoryMapper paymentStatusHistoryMapper;

    private final PaymentStatusHistorySearchRepository paymentStatusHistorySearchRepository;

    public PaymentStatusHistoryService(PaymentStatusHistoryRepository paymentStatusHistoryRepository, PaymentStatusHistoryMapper paymentStatusHistoryMapper, PaymentStatusHistorySearchRepository paymentStatusHistorySearchRepository) {
        this.paymentStatusHistoryRepository = paymentStatusHistoryRepository;
        this.paymentStatusHistoryMapper = paymentStatusHistoryMapper;
        this.paymentStatusHistorySearchRepository = paymentStatusHistorySearchRepository;
    }

    /**
     * Save a paymentStatusHistory.
     *
     * @param paymentStatusHistoryDTO the entity to save.
     * @return the persisted entity.
     */
    public PaymentStatusHistoryDTO save(PaymentStatusHistoryDTO paymentStatusHistoryDTO) {
        log.debug("Request to save PaymentStatusHistory : {}", paymentStatusHistoryDTO);
        PaymentStatusHistory paymentStatusHistory = paymentStatusHistoryMapper.toEntity(paymentStatusHistoryDTO);
        paymentStatusHistory = paymentStatusHistoryRepository.save(paymentStatusHistory);
        PaymentStatusHistoryDTO result = paymentStatusHistoryMapper.toDto(paymentStatusHistory);
        paymentStatusHistorySearchRepository.save(paymentStatusHistory);
        return result;
    }

    /**
     * Get all the paymentStatusHistories.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<PaymentStatusHistoryDTO> findAll(Pageable pageable) {
        log.debug("Request to get all PaymentStatusHistories");
        return paymentStatusHistoryRepository.findAll(pageable)
            .map(paymentStatusHistoryMapper::toDto);
    }

    /**
     * Get one paymentStatusHistory by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PaymentStatusHistoryDTO> findOne(Long id) {
        log.debug("Request to get PaymentStatusHistory : {}", id);
        return paymentStatusHistoryRepository.findById(id)
            .map(paymentStatusHistoryMapper::toDto);
    }

    /**
     * Delete the paymentStatusHistory by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete PaymentStatusHistory : {}", id);
        paymentStatusHistoryRepository.deleteById(id);
        paymentStatusHistorySearchRepository.deleteById(id);
    }

    /**
     * Search for the paymentStatusHistory corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<PaymentStatusHistoryDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of PaymentStatusHistories for query {}", query);
        return paymentStatusHistorySearchRepository.search(queryStringQuery(query), pageable)
            .map(paymentStatusHistoryMapper::toDto);
    }
}
