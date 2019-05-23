package com.wongs.web.rest;
import com.wongs.service.PaymentService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.web.rest.util.HeaderUtil;
import com.wongs.web.rest.util.PaginationUtil;
import com.wongs.service.dto.PaymentDTO;
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
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Payment.
 */
@RestController
@RequestMapping("/api")
public class PaymentResource {

    private final Logger log = LoggerFactory.getLogger(PaymentResource.class);

    private static final String ENTITY_NAME = "payment";

    private final PaymentService paymentService;

    public PaymentResource(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * POST  /payments : Create a new payment.
     *
     * @param paymentDTO the paymentDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new paymentDTO, or with status 400 (Bad Request) if the payment has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/payments")
    public ResponseEntity<PaymentDTO> createPayment(@RequestBody PaymentDTO paymentDTO) throws URISyntaxException {
        log.debug("REST request to save Payment : {}", paymentDTO);
        if (paymentDTO.getId() != null) {
            throw new BadRequestAlertException("A new payment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PaymentDTO result = paymentService.save(paymentDTO);
        return ResponseEntity.created(new URI("/api/payments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /payments : Updates an existing payment.
     *
     * @param paymentDTO the paymentDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated paymentDTO,
     * or with status 400 (Bad Request) if the paymentDTO is not valid,
     * or with status 500 (Internal Server Error) if the paymentDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/payments")
    public ResponseEntity<PaymentDTO> updatePayment(@RequestBody PaymentDTO paymentDTO) throws URISyntaxException {
        log.debug("REST request to update Payment : {}", paymentDTO);
        if (paymentDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PaymentDTO result = paymentService.save(paymentDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, paymentDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /payments : get all the payments.
     *
     * @param pageable the pagination information
     * @param filter the filter of the request
     * @return the ResponseEntity with status 200 (OK) and the list of payments in body
     */
    @GetMapping("/payments")
    public ResponseEntity<List<PaymentDTO>> getAllPayments(Pageable pageable, @RequestParam(required = false) String filter) {
        if ("order-is-null".equals(filter)) {
            log.debug("REST request to get all Payments where order is null");
            return new ResponseEntity<>(paymentService.findAllWhereOrderIsNull(),
                    HttpStatus.OK);
        }
        log.debug("REST request to get a page of Payments");
        Page<PaymentDTO> page = paymentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/payments");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /payments/:id : get the "id" payment.
     *
     * @param id the id of the paymentDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the paymentDTO, or with status 404 (Not Found)
     */
    @GetMapping("/payments/{id}")
    public ResponseEntity<PaymentDTO> getPayment(@PathVariable Long id) {
        log.debug("REST request to get Payment : {}", id);
        Optional<PaymentDTO> paymentDTO = paymentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(paymentDTO);
    }

    /**
     * DELETE  /payments/:id : delete the "id" payment.
     *
     * @param id the id of the paymentDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/payments/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        log.debug("REST request to delete Payment : {}", id);
        paymentService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/payments?query=:query : search for the payment corresponding
     * to the query.
     *
     * @param query the query of the payment search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/payments")
    public ResponseEntity<List<PaymentDTO>> searchPayments(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Payments for query {}", query);
        Page<PaymentDTO> page = paymentService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/payments");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
