package com.wongs.web.rest;

import com.wongs.service.ShippingStatusHistoryService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.ShippingStatusHistoryDTO;

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
 * REST controller for managing {@link com.wongs.domain.ShippingStatusHistory}.
 */
@RestController
@RequestMapping("/api")
public class ShippingStatusHistoryResource {

    private final Logger log = LoggerFactory.getLogger(ShippingStatusHistoryResource.class);

    private static final String ENTITY_NAME = "shippingStatusHistory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShippingStatusHistoryService shippingStatusHistoryService;

    public ShippingStatusHistoryResource(ShippingStatusHistoryService shippingStatusHistoryService) {
        this.shippingStatusHistoryService = shippingStatusHistoryService;
    }

    /**
     * {@code POST  /shipping-status-histories} : Create a new shippingStatusHistory.
     *
     * @param shippingStatusHistoryDTO the shippingStatusHistoryDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shippingStatusHistoryDTO, or with status {@code 400 (Bad Request)} if the shippingStatusHistory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shipping-status-histories")
    public ResponseEntity<ShippingStatusHistoryDTO> createShippingStatusHistory(@RequestBody ShippingStatusHistoryDTO shippingStatusHistoryDTO) throws URISyntaxException {
        log.debug("REST request to save ShippingStatusHistory : {}", shippingStatusHistoryDTO);
        if (shippingStatusHistoryDTO.getId() != null) {
            throw new BadRequestAlertException("A new shippingStatusHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShippingStatusHistoryDTO result = shippingStatusHistoryService.save(shippingStatusHistoryDTO);
        return ResponseEntity.created(new URI("/api/shipping-status-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shipping-status-histories} : Updates an existing shippingStatusHistory.
     *
     * @param shippingStatusHistoryDTO the shippingStatusHistoryDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shippingStatusHistoryDTO,
     * or with status {@code 400 (Bad Request)} if the shippingStatusHistoryDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shippingStatusHistoryDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shipping-status-histories")
    public ResponseEntity<ShippingStatusHistoryDTO> updateShippingStatusHistory(@RequestBody ShippingStatusHistoryDTO shippingStatusHistoryDTO) throws URISyntaxException {
        log.debug("REST request to update ShippingStatusHistory : {}", shippingStatusHistoryDTO);
        if (shippingStatusHistoryDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ShippingStatusHistoryDTO result = shippingStatusHistoryService.save(shippingStatusHistoryDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shippingStatusHistoryDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /shipping-status-histories} : get all the shippingStatusHistories.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shippingStatusHistories in body.
     */
    @GetMapping("/shipping-status-histories")
    public ResponseEntity<List<ShippingStatusHistoryDTO>> getAllShippingStatusHistories(Pageable pageable) {
        log.debug("REST request to get a page of ShippingStatusHistories");
        Page<ShippingStatusHistoryDTO> page = shippingStatusHistoryService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /shipping-status-histories/:id} : get the "id" shippingStatusHistory.
     *
     * @param id the id of the shippingStatusHistoryDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shippingStatusHistoryDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shipping-status-histories/{id}")
    public ResponseEntity<ShippingStatusHistoryDTO> getShippingStatusHistory(@PathVariable Long id) {
        log.debug("REST request to get ShippingStatusHistory : {}", id);
        Optional<ShippingStatusHistoryDTO> shippingStatusHistoryDTO = shippingStatusHistoryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(shippingStatusHistoryDTO);
    }

    /**
     * {@code DELETE  /shipping-status-histories/:id} : delete the "id" shippingStatusHistory.
     *
     * @param id the id of the shippingStatusHistoryDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/shipping-status-histories/{id}")
    public ResponseEntity<Void> deleteShippingStatusHistory(@PathVariable Long id) {
        log.debug("REST request to delete ShippingStatusHistory : {}", id);
        shippingStatusHistoryService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/shipping-status-histories?query=:query} : search for the shippingStatusHistory corresponding
     * to the query.
     *
     * @param query the query of the shippingStatusHistory search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/shipping-status-histories")
    public ResponseEntity<List<ShippingStatusHistoryDTO>> searchShippingStatusHistories(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ShippingStatusHistories for query {}", query);
        Page<ShippingStatusHistoryDTO> page = shippingStatusHistoryService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
