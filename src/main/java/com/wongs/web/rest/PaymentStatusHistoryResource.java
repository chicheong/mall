package com.wongs.web.rest;

import com.wongs.service.PaymentStatusHistoryService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.PaymentStatusHistoryDTO;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.wongs.domain.PaymentStatusHistory}.
 */
@RestController
@RequestMapping("/api")
public class PaymentStatusHistoryResource {

    private final Logger log = LoggerFactory.getLogger(PaymentStatusHistoryResource.class);

    private static final String ENTITY_NAME = "paymentStatusHistory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PaymentStatusHistoryService paymentStatusHistoryService;

    public PaymentStatusHistoryResource(PaymentStatusHistoryService paymentStatusHistoryService) {
        this.paymentStatusHistoryService = paymentStatusHistoryService;
    }

    /**
     * {@code POST  /payment-status-histories} : Create a new paymentStatusHistory.
     *
     * @param paymentStatusHistoryDTO the paymentStatusHistoryDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new paymentStatusHistoryDTO, or with status {@code 400 (Bad Request)} if the paymentStatusHistory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/payment-status-histories")
    public ResponseEntity<PaymentStatusHistoryDTO> createPaymentStatusHistory(@RequestBody PaymentStatusHistoryDTO paymentStatusHistoryDTO) throws URISyntaxException {
        log.debug("REST request to save PaymentStatusHistory : {}", paymentStatusHistoryDTO);
        if (paymentStatusHistoryDTO.getId() != null) {
            throw new BadRequestAlertException("A new paymentStatusHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PaymentStatusHistoryDTO result = paymentStatusHistoryService.save(paymentStatusHistoryDTO);
        return ResponseEntity.created(new URI("/api/payment-status-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /payment-status-histories} : Updates an existing paymentStatusHistory.
     *
     * @param paymentStatusHistoryDTO the paymentStatusHistoryDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated paymentStatusHistoryDTO,
     * or with status {@code 400 (Bad Request)} if the paymentStatusHistoryDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the paymentStatusHistoryDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/payment-status-histories")
    public ResponseEntity<PaymentStatusHistoryDTO> updatePaymentStatusHistory(@RequestBody PaymentStatusHistoryDTO paymentStatusHistoryDTO) throws URISyntaxException {
        log.debug("REST request to update PaymentStatusHistory : {}", paymentStatusHistoryDTO);
        if (paymentStatusHistoryDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PaymentStatusHistoryDTO result = paymentStatusHistoryService.save(paymentStatusHistoryDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, paymentStatusHistoryDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /payment-status-histories} : get all the paymentStatusHistories.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of paymentStatusHistories in body.
     */
    @GetMapping("/payment-status-histories")
    public ResponseEntity<List<PaymentStatusHistoryDTO>> getAllPaymentStatusHistories(Pageable pageable) {
        log.debug("REST request to get a page of PaymentStatusHistories");
        Page<PaymentStatusHistoryDTO> page = paymentStatusHistoryService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /payment-status-histories/:id} : get the "id" paymentStatusHistory.
     *
     * @param id the id of the paymentStatusHistoryDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the paymentStatusHistoryDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/payment-status-histories/{id}")
    public ResponseEntity<PaymentStatusHistoryDTO> getPaymentStatusHistory(@PathVariable Long id) {
        log.debug("REST request to get PaymentStatusHistory : {}", id);
        Optional<PaymentStatusHistoryDTO> paymentStatusHistoryDTO = paymentStatusHistoryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(paymentStatusHistoryDTO);
    }

    /**
     * {@code DELETE  /payment-status-histories/:id} : delete the "id" paymentStatusHistory.
     *
     * @param id the id of the paymentStatusHistoryDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/payment-status-histories/{id}")
    public ResponseEntity<Void> deletePaymentStatusHistory(@PathVariable Long id) {
        log.debug("REST request to delete PaymentStatusHistory : {}", id);
        paymentStatusHistoryService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/payment-status-histories?query=:query} : search for the paymentStatusHistory corresponding
     * to the query.
     *
     * @param query the query of the paymentStatusHistory search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/payment-status-histories")
    public ResponseEntity<List<PaymentStatusHistoryDTO>> searchPaymentStatusHistories(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of PaymentStatusHistories for query {}", query);
        Page<PaymentStatusHistoryDTO> page = paymentStatusHistoryService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
