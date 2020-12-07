package com.wongs.service;

import com.wongs.domain.PaymentCard;
import com.wongs.repository.PaymentCardRepository;
import com.wongs.repository.search.PaymentCardSearchRepository;
import com.wongs.service.dto.PaymentCardDTO;
import com.wongs.service.mapper.PaymentCardMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link PaymentCard}.
 */
@Service
@Transactional
public class PaymentCardService {

    private final Logger log = LoggerFactory.getLogger(PaymentCardService.class);

    private final PaymentCardRepository paymentCardRepository;

    private final PaymentCardMapper paymentCardMapper;

    private final PaymentCardSearchRepository paymentCardSearchRepository;

    public PaymentCardService(PaymentCardRepository paymentCardRepository, PaymentCardMapper paymentCardMapper, PaymentCardSearchRepository paymentCardSearchRepository) {
        this.paymentCardRepository = paymentCardRepository;
        this.paymentCardMapper = paymentCardMapper;
        this.paymentCardSearchRepository = paymentCardSearchRepository;
    }

    /**
     * Save a paymentCard.
     *
     * @param paymentCardDTO the entity to save.
     * @return the persisted entity.
     */
    public PaymentCardDTO save(PaymentCardDTO paymentCardDTO) {
        log.debug("Request to save PaymentCard : {}", paymentCardDTO);
        PaymentCard paymentCard = paymentCardMapper.toEntity(paymentCardDTO);
        paymentCard = paymentCardRepository.save(paymentCard);
        PaymentCardDTO result = paymentCardMapper.toDto(paymentCard);
        paymentCardSearchRepository.save(paymentCard);
        return result;
    }

    /**
     * Get all the paymentCards.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<PaymentCardDTO> findAll(Pageable pageable) {
        log.debug("Request to get all PaymentCards");
        return paymentCardRepository.findAll(pageable)
            .map(paymentCardMapper::toDto);
    }


    /**
     *  Get all the paymentCards where Payment is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true) 
    public List<PaymentCardDTO> findAllWherePaymentIsNull() {
        log.debug("Request to get all paymentCards where Payment is null");
        return StreamSupport
            .stream(paymentCardRepository.findAll().spliterator(), false)
            .filter(paymentCard -> paymentCard.getPayment() == null)
            .map(paymentCardMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one paymentCard by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PaymentCardDTO> findOne(Long id) {
        log.debug("Request to get PaymentCard : {}", id);
        return paymentCardRepository.findById(id)
            .map(paymentCardMapper::toDto);
    }

    /**
     * Delete the paymentCard by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete PaymentCard : {}", id);
        paymentCardRepository.deleteById(id);
        paymentCardSearchRepository.deleteById(id);
    }

    /**
     * Search for the paymentCard corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<PaymentCardDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of PaymentCards for query {}", query);
        return paymentCardSearchRepository.search(queryStringQuery(query), pageable)
            .map(paymentCardMapper::toDto);
    }
}
