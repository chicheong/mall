package com.wongs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.wongs.domain.ShippingPriceRule;

import com.wongs.repository.ShippingPriceRuleRepository;
import com.wongs.repository.search.ShippingPriceRuleSearchRepository;
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
 * REST controller for managing ShippingPriceRule.
 */
@RestController
@RequestMapping("/api")
public class ShippingPriceRuleResource {

    private final Logger log = LoggerFactory.getLogger(ShippingPriceRuleResource.class);

    private static final String ENTITY_NAME = "shippingPriceRule";

    private final ShippingPriceRuleRepository shippingPriceRuleRepository;

    private final ShippingPriceRuleSearchRepository shippingPriceRuleSearchRepository;

    public ShippingPriceRuleResource(ShippingPriceRuleRepository shippingPriceRuleRepository, ShippingPriceRuleSearchRepository shippingPriceRuleSearchRepository) {
        this.shippingPriceRuleRepository = shippingPriceRuleRepository;
        this.shippingPriceRuleSearchRepository = shippingPriceRuleSearchRepository;
    }

    /**
     * POST  /shipping-price-rules : Create a new shippingPriceRule.
     *
     * @param shippingPriceRule the shippingPriceRule to create
     * @return the ResponseEntity with status 201 (Created) and with body the new shippingPriceRule, or with status 400 (Bad Request) if the shippingPriceRule has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/shipping-price-rules")
    @Timed
    public ResponseEntity<ShippingPriceRule> createShippingPriceRule(@RequestBody ShippingPriceRule shippingPriceRule) throws URISyntaxException {
        log.debug("REST request to save ShippingPriceRule : {}", shippingPriceRule);
        if (shippingPriceRule.getId() != null) {
            throw new BadRequestAlertException("A new shippingPriceRule cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShippingPriceRule result = shippingPriceRuleRepository.save(shippingPriceRule);
        shippingPriceRuleSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/shipping-price-rules/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /shipping-price-rules : Updates an existing shippingPriceRule.
     *
     * @param shippingPriceRule the shippingPriceRule to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated shippingPriceRule,
     * or with status 400 (Bad Request) if the shippingPriceRule is not valid,
     * or with status 500 (Internal Server Error) if the shippingPriceRule couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/shipping-price-rules")
    @Timed
    public ResponseEntity<ShippingPriceRule> updateShippingPriceRule(@RequestBody ShippingPriceRule shippingPriceRule) throws URISyntaxException {
        log.debug("REST request to update ShippingPriceRule : {}", shippingPriceRule);
        if (shippingPriceRule.getId() == null) {
            return createShippingPriceRule(shippingPriceRule);
        }
        ShippingPriceRule result = shippingPriceRuleRepository.save(shippingPriceRule);
        shippingPriceRuleSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, shippingPriceRule.getId().toString()))
            .body(result);
    }

    /**
     * GET  /shipping-price-rules : get all the shippingPriceRules.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of shippingPriceRules in body
     */
    @GetMapping("/shipping-price-rules")
    @Timed
    public ResponseEntity<List<ShippingPriceRule>> getAllShippingPriceRules(Pageable pageable) {
        log.debug("REST request to get a page of ShippingPriceRules");
        Page<ShippingPriceRule> page = shippingPriceRuleRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/shipping-price-rules");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /shipping-price-rules/:id : get the "id" shippingPriceRule.
     *
     * @param id the id of the shippingPriceRule to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the shippingPriceRule, or with status 404 (Not Found)
     */
    @GetMapping("/shipping-price-rules/{id}")
    @Timed
    public ResponseEntity<ShippingPriceRule> getShippingPriceRule(@PathVariable Long id) {
        log.debug("REST request to get ShippingPriceRule : {}", id);
        ShippingPriceRule shippingPriceRule = shippingPriceRuleRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(shippingPriceRule));
    }

    /**
     * DELETE  /shipping-price-rules/:id : delete the "id" shippingPriceRule.
     *
     * @param id the id of the shippingPriceRule to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/shipping-price-rules/{id}")
    @Timed
    public ResponseEntity<Void> deleteShippingPriceRule(@PathVariable Long id) {
        log.debug("REST request to delete ShippingPriceRule : {}", id);
        shippingPriceRuleRepository.delete(id);
        shippingPriceRuleSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/shipping-price-rules?query=:query : search for the shippingPriceRule corresponding
     * to the query.
     *
     * @param query the query of the shippingPriceRule search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/shipping-price-rules")
    @Timed
    public ResponseEntity<List<ShippingPriceRule>> searchShippingPriceRules(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ShippingPriceRules for query {}", query);
        Page<ShippingPriceRule> page = shippingPriceRuleSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/shipping-price-rules");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
