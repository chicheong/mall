package com.wongs.service;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wongs.domain.MyOrder;
import com.wongs.domain.Payment;
import com.wongs.domain.enumeration.PaymentStatus;
import com.wongs.repository.PaymentRepository;
import com.wongs.repository.search.PaymentSearchRepository;
import com.wongs.service.dto.PaymentDTO;
import com.wongs.service.mapper.MyOrderMapper;
import com.wongs.service.mapper.PaymentMapper;

/**
 * Service Implementation for managing Payment.
 */
@Service
@Transactional
public class PaymentService {

    private final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentMapper paymentMapper;
    private final MyOrderMapper myOrderMapper;
    
    private final PaymentRepository paymentRepository;
    private final PaymentSearchRepository paymentSearchRepository;

    public PaymentService(PaymentMapper paymentMapper, MyOrderMapper myOrderMapper, PaymentRepository paymentRepository, PaymentSearchRepository paymentSearchRepository) {
        this.paymentMapper = paymentMapper;
    	this.myOrderMapper = myOrderMapper;
    	this.paymentRepository = paymentRepository;
        this.paymentSearchRepository = paymentSearchRepository;
    }

    /**
     * Save a payment.
     *
     * @param paymentDTO the entity to save
     * @return the persisted entity
     */
    public PaymentDTO save(PaymentDTO paymentDTO) {
        log.debug("Request to save Payment : {}", paymentDTO);
        Payment payment = paymentMapper.toEntity(paymentDTO);
        payment = paymentRepository.save(payment);
        PaymentDTO result = paymentMapper.toDto(payment);
        paymentSearchRepository.save(payment);
        return result;
    }
    
    /**
     * Create a payment from MyOrder
     *
     * @param paymentDTO the entity to create
     * @return the persisted entity
     */
    public PaymentDTO create(MyOrder myOrder) {
        log.debug("Request to create Payment from MyOrder : {}", myOrder);
        PaymentDTO payment = new PaymentDTO();
        payment.setOrder(myOrder);
        payment.setCurrency(myOrder.getCurrency());
        payment.setStatus(PaymentStatus.PENDING);
        return this.save(payment);
    }


    /**
     * Get all the payments.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<PaymentDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Payments");
        return paymentRepository.findAll(pageable)
            .map(paymentMapper::toDto);
    }

    /**
     * Get one payment by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public PaymentDTO findOne(Long id) {
        log.debug("Request to get Payment : {}", id);
        Payment payment = paymentRepository.findOne(id);
        return paymentMapper.toDto(payment);
    }

    /**
     * Get one payment by MyOrder.
     *
     * @param MyOrder
     * @return the entity
     */
    @Transactional(readOnly = true)
    public PaymentDTO findByOrder(MyOrder myOrder) {
        log.debug("Request to get Payment from MyOrder : {}", myOrder);
        Payment payment = paymentRepository.findByOrder(myOrder);
        return paymentMapper.toDto(payment);
    }
    
    /**
     * Delete the payment by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Payment : {}", id);
        paymentRepository.delete(id);
        paymentSearchRepository.delete(id);
    }

    /**
     * Search for the payment corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<PaymentDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Payments for query {}", query);
        Page<Payment> result = paymentSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(paymentMapper::toDto);
    }
}
