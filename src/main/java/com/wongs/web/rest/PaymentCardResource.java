package com.wongs.web.rest;

import com.wongs.service.PaymentCardService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.PaymentCardDTO;

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
 * REST controller for managing {@link com.wongs.domain.PaymentCard}.
 */
@RestController
@RequestMapping("/api")
public class PaymentCardResource {

    private final Logger log = LoggerFactory.getLogger(PaymentCardResource.class);

    private static final String ENTITY_NAME = "paymentCard";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PaymentCardService paymentCardService;

    public PaymentCardResource(PaymentCardService paymentCardService) {
        this.paymentCardService = paymentCardService;
    }

    /**
     * {@code POST  /payment-cards} : Create a new paymentCard.
     *
     * @param paymentCardDTO the paymentCardDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new paymentCardDTO, or with status {@code 400 (Bad Request)} if the paymentCard has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/payment-cards")
    public ResponseEntity<PaymentCardDTO> createPaymentCard(@RequestBody PaymentCardDTO paymentCardDTO) throws URISyntaxException {
        log.debug("REST request to save PaymentCard : {}", paymentCardDTO);
        if (paymentCardDTO.getId() != null) {
            throw new BadRequestAlertException("A new paymentCard cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PaymentCardDTO result = paymentCardService.save(paymentCardDTO);
        return ResponseEntity.created(new URI("/api/payment-cards/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /payment-cards} : Updates an existing paymentCard.
     *
     * @param paymentCardDTO the paymentCardDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated paymentCardDTO,
     * or with status {@code 400 (Bad Request)} if the paymentCardDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the paymentCardDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/payment-cards")
    public ResponseEntity<PaymentCardDTO> updatePaymentCard(@RequestBody PaymentCardDTO paymentCardDTO) throws URISyntaxException {
        log.debug("REST request to update PaymentCard : {}", paymentCardDTO);
        if (paymentCardDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PaymentCardDTO result = paymentCardService.save(paymentCardDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, paymentCardDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /payment-cards} : get all the paymentCards.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of paymentCards in body.
     */
    @GetMapping("/payment-cards")
    public ResponseEntity<List<PaymentCardDTO>> getAllPaymentCards(Pageable pageable, @RequestParam(required = false) String filter) {
        if ("payment-is-null".equals(filter)) {
            log.debug("REST request to get all PaymentCards where payment is null");
            return new ResponseEntity<>(paymentCardService.findAllWherePaymentIsNull(),
                    HttpStatus.OK);
        }
        log.debug("REST request to get a page of PaymentCards");
        Page<PaymentCardDTO> page = paymentCardService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /payment-cards/:id} : get the "id" paymentCard.
     *
     * @param id the id of the paymentCardDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the paymentCardDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/payment-cards/{id}")
    public ResponseEntity<PaymentCardDTO> getPaymentCard(@PathVariable Long id) {
        log.debug("REST request to get PaymentCard : {}", id);
        Optional<PaymentCardDTO> paymentCardDTO = paymentCardService.findOne(id);
        return ResponseUtil.wrapOrNotFound(paymentCardDTO);
    }

    /**
     * {@code DELETE  /payment-cards/:id} : delete the "id" paymentCard.
     *
     * @param id the id of the paymentCardDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/payment-cards/{id}")
    public ResponseEntity<Void> deletePaymentCard(@PathVariable Long id) {
        log.debug("REST request to delete PaymentCard : {}", id);
        paymentCardService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/payment-cards?query=:query} : search for the paymentCard corresponding
     * to the query.
     *
     * @param query the query of the paymentCard search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/payment-cards")
    public ResponseEntity<List<PaymentCardDTO>> searchPaymentCards(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of PaymentCards for query {}", query);
        Page<PaymentCardDTO> page = paymentCardService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
