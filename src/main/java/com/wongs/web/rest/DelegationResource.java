package com.wongs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.wongs.service.DelegationService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.web.rest.util.HeaderUtil;
import com.wongs.web.rest.util.PaginationUtil;
import com.wongs.service.dto.DelegationDTO;
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
 * REST controller for managing Delegation.
 */
@RestController
@RequestMapping("/api")
public class DelegationResource {

    private final Logger log = LoggerFactory.getLogger(DelegationResource.class);

    private static final String ENTITY_NAME = "delegation";

    private final DelegationService delegationService;

    public DelegationResource(DelegationService delegationService) {
        this.delegationService = delegationService;
    }

    /**
     * POST  /delegations : Create a new delegation.
     *
     * @param delegationDTO the delegationDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new delegationDTO, or with status 400 (Bad Request) if the delegation has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/delegations")
    @Timed
    public ResponseEntity<DelegationDTO> createDelegation(@RequestBody DelegationDTO delegationDTO) throws URISyntaxException {
        log.debug("REST request to save Delegation : {}", delegationDTO);
        if (delegationDTO.getId() != null) {
            throw new BadRequestAlertException("A new delegation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DelegationDTO result = delegationService.save(delegationDTO);
        return ResponseEntity.created(new URI("/api/delegations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /delegations : Updates an existing delegation.
     *
     * @param delegationDTO the delegationDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated delegationDTO,
     * or with status 400 (Bad Request) if the delegationDTO is not valid,
     * or with status 500 (Internal Server Error) if the delegationDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/delegations")
    @Timed
    public ResponseEntity<DelegationDTO> updateDelegation(@RequestBody DelegationDTO delegationDTO) throws URISyntaxException {
        log.debug("REST request to update Delegation : {}", delegationDTO);
        if (delegationDTO.getId() == null) {
            return createDelegation(delegationDTO);
        }
        DelegationDTO result = delegationService.save(delegationDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, delegationDTO.getId().toString()))
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
    public ResponseEntity<List<DelegationDTO>> getAllDelegations(Pageable pageable) {
        log.debug("REST request to get a page of Delegations");
        Page<DelegationDTO> page = delegationService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/delegations");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /delegations/:id : get the "id" delegation.
     *
     * @param id the id of the delegationDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the delegationDTO, or with status 404 (Not Found)
     */
    @GetMapping("/delegations/{id}")
    @Timed
    public ResponseEntity<DelegationDTO> getDelegation(@PathVariable Long id) {
        log.debug("REST request to get Delegation : {}", id);
        DelegationDTO delegationDTO = delegationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(delegationDTO));
    }

    /**
     * DELETE  /delegations/:id : delete the "id" delegation.
     *
     * @param id the id of the delegationDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/delegations/{id}")
    @Timed
    public ResponseEntity<Void> deleteDelegation(@PathVariable Long id) {
        log.debug("REST request to delete Delegation : {}", id);
        delegationService.delete(id);
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
    public ResponseEntity<List<DelegationDTO>> searchDelegations(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Delegations for query {}", query);
        Page<DelegationDTO> page = delegationService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/delegations");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
