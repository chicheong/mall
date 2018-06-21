package com.wongs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.wongs.domain.PaymentCreditCard;

import com.wongs.repository.PaymentCreditCardRepository;
import com.wongs.repository.search.PaymentCreditCardSearchRepository;
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
 * REST controller for managing PaymentCreditCard.
 */
@RestController
@RequestMapping("/api")
public class PaymentCreditCardResource {

    private final Logger log = LoggerFactory.getLogger(PaymentCreditCardResource.class);

    private static final String ENTITY_NAME = "paymentCreditCard";

    private final PaymentCreditCardRepository paymentCreditCardRepository;

    private final PaymentCreditCardSearchRepository paymentCreditCardSearchRepository;

    public PaymentCreditCardResource(PaymentCreditCardRepository paymentCreditCardRepository, PaymentCreditCardSearchRepository paymentCreditCardSearchRepository) {
        this.paymentCreditCardRepository = paymentCreditCardRepository;
        this.paymentCreditCardSearchRepository = paymentCreditCardSearchRepository;
    }

    /**
     * POST  /payment-credit-cards : Create a new paymentCreditCard.
     *
     * @param paymentCreditCard the paymentCreditCard to create
     * @return the ResponseEntity with status 201 (Created) and with body the new paymentCreditCard, or with status 400 (Bad Request) if the paymentCreditCard has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/payment-credit-cards")
    @Timed
    public ResponseEntity<PaymentCreditCard> createPaymentCreditCard(@RequestBody PaymentCreditCard paymentCreditCard) throws URISyntaxException {
        log.debug("REST request to save PaymentCreditCard : {}", paymentCreditCard);
        if (paymentCreditCard.getId() != null) {
            throw new BadRequestAlertException("A new paymentCreditCard cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PaymentCreditCard result = paymentCreditCardRepository.save(paymentCreditCard);
        paymentCreditCardSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/payment-credit-cards/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /payment-credit-cards : Updates an existing paymentCreditCard.
     *
     * @param paymentCreditCard the paymentCreditCard to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated paymentCreditCard,
     * or with status 400 (Bad Request) if the paymentCreditCard is not valid,
     * or with status 500 (Internal Server Error) if the paymentCreditCard couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/payment-credit-cards")
    @Timed
    public ResponseEntity<PaymentCreditCard> updatePaymentCreditCard(@RequestBody PaymentCreditCard paymentCreditCard) throws URISyntaxException {
        log.debug("REST request to update PaymentCreditCard : {}", paymentCreditCard);
        if (paymentCreditCard.getId() == null) {
            return createPaymentCreditCard(paymentCreditCard);
        }
        PaymentCreditCard result = paymentCreditCardRepository.save(paymentCreditCard);
        paymentCreditCardSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, paymentCreditCard.getId().toString()))
            .body(result);
    }

    /**
     * GET  /payment-credit-cards : get all the paymentCreditCards.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of paymentCreditCards in body
     */
    @GetMapping("/payment-credit-cards")
    @Timed
    public ResponseEntity<List<PaymentCreditCard>> getAllPaymentCreditCards(Pageable pageable) {
        log.debug("REST request to get a page of PaymentCreditCards");
        Page<PaymentCreditCard> page = paymentCreditCardRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/payment-credit-cards");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /payment-credit-cards/:id : get the "id" paymentCreditCard.
     *
     * @param id the id of the paymentCreditCard to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the paymentCreditCard, or with status 404 (Not Found)
     */
    @GetMapping("/payment-credit-cards/{id}")
    @Timed
    public ResponseEntity<PaymentCreditCard> getPaymentCreditCard(@PathVariable Long id) {
        log.debug("REST request to get PaymentCreditCard : {}", id);
        PaymentCreditCard paymentCreditCard = paymentCreditCardRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(paymentCreditCard));
    }

    /**
     * DELETE  /payment-credit-cards/:id : delete the "id" paymentCreditCard.
     *
     * @param id the id of the paymentCreditCard to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/payment-credit-cards/{id}")
    @Timed
    public ResponseEntity<Void> deletePaymentCreditCard(@PathVariable Long id) {
        log.debug("REST request to delete PaymentCreditCard : {}", id);
        paymentCreditCardRepository.delete(id);
        paymentCreditCardSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/payment-credit-cards?query=:query : search for the paymentCreditCard corresponding
     * to the query.
     *
     * @param query the query of the paymentCreditCard search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/payment-credit-cards")
    @Timed
    public ResponseEntity<List<PaymentCreditCard>> searchPaymentCreditCards(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of PaymentCreditCards for query {}", query);
        Page<PaymentCreditCard> page = paymentCreditCardSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/payment-credit-cards");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
