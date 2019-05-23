package com.wongs.web.rest;
import com.wongs.domain.ShippingStatusHistory;
import com.wongs.repository.ShippingStatusHistoryRepository;
import com.wongs.repository.search.ShippingStatusHistorySearchRepository;
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
 * REST controller for managing ShippingStatusHistory.
 */
@RestController
@RequestMapping("/api")
public class ShippingStatusHistoryResource {

    private final Logger log = LoggerFactory.getLogger(ShippingStatusHistoryResource.class);

    private static final String ENTITY_NAME = "shippingStatusHistory";

    private final ShippingStatusHistoryRepository shippingStatusHistoryRepository;

    private final ShippingStatusHistorySearchRepository shippingStatusHistorySearchRepository;

    public ShippingStatusHistoryResource(ShippingStatusHistoryRepository shippingStatusHistoryRepository, ShippingStatusHistorySearchRepository shippingStatusHistorySearchRepository) {
        this.shippingStatusHistoryRepository = shippingStatusHistoryRepository;
        this.shippingStatusHistorySearchRepository = shippingStatusHistorySearchRepository;
    }

    /**
     * POST  /shipping-status-histories : Create a new shippingStatusHistory.
     *
     * @param shippingStatusHistory the shippingStatusHistory to create
     * @return the ResponseEntity with status 201 (Created) and with body the new shippingStatusHistory, or with status 400 (Bad Request) if the shippingStatusHistory has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/shipping-status-histories")
    public ResponseEntity<ShippingStatusHistory> createShippingStatusHistory(@RequestBody ShippingStatusHistory shippingStatusHistory) throws URISyntaxException {
        log.debug("REST request to save ShippingStatusHistory : {}", shippingStatusHistory);
        if (shippingStatusHistory.getId() != null) {
            throw new BadRequestAlertException("A new shippingStatusHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShippingStatusHistory result = shippingStatusHistoryRepository.save(shippingStatusHistory);
        shippingStatusHistorySearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/shipping-status-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /shipping-status-histories : Updates an existing shippingStatusHistory.
     *
     * @param shippingStatusHistory the shippingStatusHistory to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated shippingStatusHistory,
     * or with status 400 (Bad Request) if the shippingStatusHistory is not valid,
     * or with status 500 (Internal Server Error) if the shippingStatusHistory couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/shipping-status-histories")
    public ResponseEntity<ShippingStatusHistory> updateShippingStatusHistory(@RequestBody ShippingStatusHistory shippingStatusHistory) throws URISyntaxException {
        log.debug("REST request to update ShippingStatusHistory : {}", shippingStatusHistory);
        if (shippingStatusHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ShippingStatusHistory result = shippingStatusHistoryRepository.save(shippingStatusHistory);
        shippingStatusHistorySearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, shippingStatusHistory.getId().toString()))
            .body(result);
    }

    /**
     * GET  /shipping-status-histories : get all the shippingStatusHistories.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of shippingStatusHistories in body
     */
    @GetMapping("/shipping-status-histories")
    public ResponseEntity<List<ShippingStatusHistory>> getAllShippingStatusHistories(Pageable pageable) {
        log.debug("REST request to get a page of ShippingStatusHistories");
        Page<ShippingStatusHistory> page = shippingStatusHistoryRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/shipping-status-histories");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /shipping-status-histories/:id : get the "id" shippingStatusHistory.
     *
     * @param id the id of the shippingStatusHistory to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the shippingStatusHistory, or with status 404 (Not Found)
     */
    @GetMapping("/shipping-status-histories/{id}")
    public ResponseEntity<ShippingStatusHistory> getShippingStatusHistory(@PathVariable Long id) {
        log.debug("REST request to get ShippingStatusHistory : {}", id);
        Optional<ShippingStatusHistory> shippingStatusHistory = shippingStatusHistoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(shippingStatusHistory);
    }

    /**
     * DELETE  /shipping-status-histories/:id : delete the "id" shippingStatusHistory.
     *
     * @param id the id of the shippingStatusHistory to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/shipping-status-histories/{id}")
    public ResponseEntity<Void> deleteShippingStatusHistory(@PathVariable Long id) {
        log.debug("REST request to delete ShippingStatusHistory : {}", id);
        shippingStatusHistoryRepository.deleteById(id);
        shippingStatusHistorySearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/shipping-status-histories?query=:query : search for the shippingStatusHistory corresponding
     * to the query.
     *
     * @param query the query of the shippingStatusHistory search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/shipping-status-histories")
    public ResponseEntity<List<ShippingStatusHistory>> searchShippingStatusHistories(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ShippingStatusHistories for query {}", query);
        Page<ShippingStatusHistory> page = shippingStatusHistorySearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/shipping-status-histories");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
