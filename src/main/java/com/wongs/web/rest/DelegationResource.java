package com.wongs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.wongs.domain.Delegation;

import com.wongs.repository.DelegationRepository;
import com.wongs.repository.search.DelegationSearchRepository;
import com.wongs.web.rest.util.HeaderUtil;
import com.wongs.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
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
 * REST controller for managing Delegation.
 */
@RestController
@RequestMapping("/api")
public class DelegationResource {

    private final Logger log = LoggerFactory.getLogger(DelegationResource.class);

    private static final String ENTITY_NAME = "delegation";

    private final DelegationRepository delegationRepository;

    private final DelegationSearchRepository delegationSearchRepository;

    public DelegationResource(DelegationRepository delegationRepository, DelegationSearchRepository delegationSearchRepository) {
        this.delegationRepository = delegationRepository;
        this.delegationSearchRepository = delegationSearchRepository;
    }

    /**
     * POST  /delegations : Create a new delegation.
     *
     * @param delegation the delegation to create
     * @return the ResponseEntity with status 201 (Created) and with body the new delegation, or with status 400 (Bad Request) if the delegation has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/delegations")
    @Timed
    public ResponseEntity<Delegation> createDelegation(@RequestBody Delegation delegation) throws URISyntaxException {
        log.debug("REST request to save Delegation : {}", delegation);
        if (delegation.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new delegation cannot already have an ID")).body(null);
        }
        Delegation result = delegationRepository.save(delegation);
        delegationSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/delegations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /delegations : Updates an existing delegation.
     *
     * @param delegation the delegation to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated delegation,
     * or with status 400 (Bad Request) if the delegation is not valid,
     * or with status 500 (Internal Server Error) if the delegation couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/delegations")
    @Timed
    public ResponseEntity<Delegation> updateDelegation(@RequestBody Delegation delegation) throws URISyntaxException {
        log.debug("REST request to update Delegation : {}", delegation);
        if (delegation.getId() == null) {
            return createDelegation(delegation);
        }
        Delegation result = delegationRepository.save(delegation);
        delegationSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, delegation.getId().toString()))
            .body(result);
    }

    /**
     * GET  /delegations : get all the delegations.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of delegations in body
     */
    @GetMapping("/delegations")
    @Timed
    public ResponseEntity<List<Delegation>> getAllDelegations(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Delegations");
        Page<Delegation> page = delegationRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/delegations");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /delegations/:id : get the "id" delegation.
     *
     * @param id the id of the delegation to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the delegation, or with status 404 (Not Found)
     */
    @GetMapping("/delegations/{id}")
    @Timed
    public ResponseEntity<Delegation> getDelegation(@PathVariable Long id) {
        log.debug("REST request to get Delegation : {}", id);
        Delegation delegation = delegationRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(delegation));
    }

    /**
     * DELETE  /delegations/:id : delete the "id" delegation.
     *
     * @param id the id of the delegation to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/delegations/{id}")
    @Timed
    public ResponseEntity<Void> deleteDelegation(@PathVariable Long id) {
        log.debug("REST request to delete Delegation : {}", id);
        delegationRepository.delete(id);
        delegationSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/delegations?query=:query : search for the delegation corresponding
     * to the query.
     *
     * @param query the query of the delegation search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/delegations")
    @Timed
    public ResponseEntity<List<Delegation>> searchDelegations(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of Delegations for query {}", query);
        Page<Delegation> page = delegationSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/delegations");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
