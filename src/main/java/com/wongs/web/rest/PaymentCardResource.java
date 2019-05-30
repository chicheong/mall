package com.wongs.web.rest;
import com.wongs.domain.PaymentCard;
import com.wongs.repository.PaymentCardRepository;
import com.wongs.repository.search.PaymentCardSearchRepository;
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
 * REST controller for managing PaymentCard.
 */
@RestController
@RequestMapping("/api")
public class PaymentCardResource {

    private final Logger log = LoggerFactory.getLogger(PaymentCardResource.class);

    private static final String ENTITY_NAME = "paymentCard";

    private final PaymentCardRepository paymentCardRepository;

    private final PaymentCardSearchRepository paymentCardSearchRepository;

    public PaymentCardResource(PaymentCardRepository paymentCardRepository, PaymentCardSearchRepository paymentCardSearchRepository) {
        this.paymentCardRepository = paymentCardRepository;
        this.paymentCardSearchRepository = paymentCardSearchRepository;
    }

    /**
     * POST  /payment-cards : Create a new paymentCard.
     *
     * @param paymentCard the paymentCard to create
     * @return the ResponseEntity with status 201 (Created) and with body the new paymentCard, or with status 400 (Bad Request) if the paymentCard has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/payment-cards")
    public ResponseEntity<PaymentCard> createPaymentCard(@RequestBody PaymentCard paymentCard) throws URISyntaxException {
        log.debug("REST request to save PaymentCard : {}", paymentCard);
        if (paymentCard.getId() != null) {
            throw new BadRequestAlertException("A new paymentCard cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PaymentCard result = paymentCardRepository.save(paymentCard);
        paymentCardSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/payment-cards/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /payment-cards : Updates an existing paymentCard.
     *
     * @param paymentCard the paymentCard to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated paymentCard,
     * or with status 400 (Bad Request) if the paymentCard is not valid,
     * or with status 500 (Internal Server Error) if the paymentCard couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/payment-cards")
    public ResponseEntity<PaymentCard> updatePaymentCard(@RequestBody PaymentCard paymentCard) throws URISyntaxException {
        log.debug("REST request to update PaymentCard : {}", paymentCard);
        if (paymentCard.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PaymentCard result = paymentCardRepository.save(paymentCard);
        paymentCardSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, paymentCard.getId().toString()))
            .body(result);
    }

    /**
     * GET  /payment-cards : get all the paymentCards.
     *
     * @param pageable the pagination information
     * @param filter the filter of the request
     * @return the ResponseEntity with status 200 (OK) and the list of paymentCards in body
     */
    @GetMapping("/payment-cards")
    public ResponseEntity<List<PaymentCard>> getAllPaymentCards(Pageable pageable, @RequestParam(required = false) String filter) {
    	/**if ("payment-is-null".equals(filter)) {
            log.debug("REST request to get all PaymentCards where payment is null");
            return new ResponseEntity<>(StreamSupport
                .stream(paymentCardRepository.findAll().spliterator(), false)
                .filter(paymentCard -> paymentCard.getPayment() == null)
                .collect(Collectors.toList()), HttpStatus.OK);
        }*/
        log.debug("REST request to get a page of PaymentCards");
        Page<PaymentCard> page = paymentCardRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/payment-cards");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /payment-cards/:id : get the "id" paymentCard.
     *
     * @param id the id of the paymentCard to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the paymentCard, or with status 404 (Not Found)
     */
    @GetMapping("/payment-cards/{id}")
    public ResponseEntity<PaymentCard> getPaymentCard(@PathVariable Long id) {
        log.debug("REST request to get PaymentCard : {}", id);
        Optional<PaymentCard> paymentCard = paymentCardRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(paymentCard);
    }

    /**
     * DELETE  /payment-cards/:id : delete the "id" paymentCard.
     *
     * @param id the id of the paymentCard to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/payment-cards/{id}")
    public ResponseEntity<Void> deletePaymentCard(@PathVariable Long id) {
        log.debug("REST request to delete PaymentCard : {}", id);
        paymentCardRepository.deleteById(id);
        paymentCardSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/payment-cards?query=:query : search for the paymentCard corresponding
     * to the query.
     *
     * @param query the query of the paymentCard search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/payment-cards")
    public ResponseEntity<List<PaymentCard>> searchPaymentCards(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of PaymentCards for query {}", query);
        Page<PaymentCard> page = paymentCardSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/payment-cards");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
