package com.wongs.web.rest;
import com.wongs.domain.PaymentStatusHistory;
import com.wongs.repository.PaymentStatusHistoryRepository;
import com.wongs.repository.search.PaymentStatusHistorySearchRepository;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.web.rest.util.HeaderUtil;
import com.wongs.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing PaymentStatusHistory.
 */
@RestController
@RequestMapping("/api")
public class PaymentStatusHistoryResource {

    private final Logger log = LoggerFactory.getLogger(PaymentStatusHistoryResource.class);

    private static final String ENTITY_NAME = "paymentStatusHistory";

    private final PaymentStatusHistoryRepository paymentStatusHistoryRepository;

    private final PaymentStatusHistorySearchRepository paymentStatusHistorySearchRepository;

    public PaymentStatusHistoryResource(PaymentStatusHistoryRepository paymentStatusHistoryRepository, PaymentStatusHistorySearchRepository paymentStatusHistorySearchRepository) {
        this.paymentStatusHistoryRepository = paymentStatusHistoryRepository;
        this.paymentStatusHistorySearchRepository = paymentStatusHistorySearchRepository;
    }

    /**
     * POST  /payment-status-histories : Create a new paymentStatusHistory.
     *
     * @param paymentStatusHistory the paymentStatusHistory to create
     * @return the ResponseEntity with status 201 (Created) and with body the new paymentStatusHistory, or with status 400 (Bad Request) if the paymentStatusHistory has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/payment-status-histories")
    public ResponseEntity<PaymentStatusHistory> createPaymentStatusHistory(@RequestBody PaymentStatusHistory paymentStatusHistory) throws URISyntaxException {
        log.debug("REST request to save PaymentStatusHistory : {}", paymentStatusHistory);
        if (paymentStatusHistory.getId() != null) {
            throw new BadRequestAlertException("A new paymentStatusHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PaymentStatusHistory result = paymentStatusHistoryRepository.save(paymentStatusHistory);
        paymentStatusHistorySearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/payment-status-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /payment-status-histories : Updates an existing paymentStatusHistory.
     *
     * @param paymentStatusHistory the paymentStatusHistory to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated paymentStatusHistory,
     * or with status 400 (Bad Request) if the paymentStatusHistory is not valid,
     * or with status 500 (Internal Server Error) if the paymentStatusHistory couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/payment-status-histories")
    public ResponseEntity<PaymentStatusHistory> updatePaymentStatusHistory(@RequestBody PaymentStatusHistory paymentStatusHistory) throws URISyntaxException {
        log.debug("REST request to update PaymentStatusHistory : {}", paymentStatusHistory);
        if (paymentStatusHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PaymentStatusHistory result = paymentStatusHistoryRepository.save(paymentStatusHistory);
        paymentStatusHistorySearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, paymentStatusHistory.getId().toString()))
            .body(result);
    }

    /**
     * GET  /payment-status-histories : get all the paymentStatusHistories.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of paymentStatusHistories in body
     */
    @GetMapping("/payment-status-histories")
    public ResponseEntity<List<PaymentStatusHistory>> getAllPaymentStatusHistories(Pageable pageable) {
        log.debug("REST request to get a page of PaymentStatusHistories");
        Page<PaymentStatusHistory> page = paymentStatusHistoryRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/payment-status-histories");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /payment-status-histories/:id : get the "id" paymentStatusHistory.
     *
     * @param id the id of the paymentStatusHistory to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the paymentStatusHistory, or with status 404 (Not Found)
     */
    @GetMapping("/payment-status-histories/{id}")
    public ResponseEntity<PaymentStatusHistory> getPaymentStatusHistory(@PathVariable Long id) {
        log.debug("REST request to get PaymentStatusHistory : {}", id);
        Optional<PaymentStatusHistory> paymentStatusHistory = paymentStatusHistoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(paymentStatusHistory);
    }

    /**
     * DELETE  /payment-status-histories/:id : delete the "id" paymentStatusHistory.
     *
     * @param id the id of the paymentStatusHistory to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/payment-status-histories/{id}")
    public ResponseEntity<Void> deletePaymentStatusHistory(@PathVariable Long id) {
        log.debug("REST request to delete PaymentStatusHistory : {}", id);
        paymentStatusHistoryRepository.deleteById(id);
        paymentStatusHistorySearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/payment-status-histories?query=:query : search for the paymentStatusHistory corresponding
     * to the query.
     *
     * @param query the query of the paymentStatusHistory search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/payment-status-histories")
    public ResponseEntity<List<PaymentStatusHistory>> searchPaymentStatusHistories(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of PaymentStatusHistories for query {}", query);
        Page<PaymentStatusHistory> page = paymentStatusHistorySearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/payment-status-histories");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
