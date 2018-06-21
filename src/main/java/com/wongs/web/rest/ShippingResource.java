package com.wongs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.wongs.service.ShippingService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.web.rest.util.HeaderUtil;
import com.wongs.web.rest.util.PaginationUtil;
import com.wongs.service.dto.ShippingDTO;
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
 * REST controller for managing Shipping.
 */
@RestController
@RequestMapping("/api")
public class ShippingResource {

    private final Logger log = LoggerFactory.getLogger(ShippingResource.class);

    private static final String ENTITY_NAME = "shipping";

    private final ShippingService shippingService;

    public ShippingResource(ShippingService shippingService) {
        this.shippingService = shippingService;
    }

    /**
     * POST  /shippings : Create a new shipping.
     *
     * @param shippingDTO the shippingDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new shippingDTO, or with status 400 (Bad Request) if the shipping has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/shippings")
    @Timed
    public ResponseEntity<ShippingDTO> createShipping(@RequestBody ShippingDTO shippingDTO) throws URISyntaxException {
        log.debug("REST request to save Shipping : {}", shippingDTO);
        if (shippingDTO.getId() != null) {
            throw new BadRequestAlertException("A new shipping cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShippingDTO result = shippingService.save(shippingDTO);
        return ResponseEntity.created(new URI("/api/shippings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /shippings : Updates an existing shipping.
     *
     * @param shippingDTO the shippingDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated shippingDTO,
     * or with status 400 (Bad Request) if the shippingDTO is not valid,
     * or with status 500 (Internal Server Error) if the shippingDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/shippings")
    @Timed
    public ResponseEntity<ShippingDTO> updateShipping(@RequestBody ShippingDTO shippingDTO) throws URISyntaxException {
        log.debug("REST request to update Shipping : {}", shippingDTO);
        if (shippingDTO.getId() == null) {
            return createShipping(shippingDTO);
        }
        ShippingDTO result = shippingService.save(shippingDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, shippingDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /shippings : get all the shippings.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of shippings in body
     */
    @GetMapping("/shippings")
    @Timed
    public ResponseEntity<List<ShippingDTO>> getAllShippings(Pageable pageable) {
        log.debug("REST request to get a page of Shippings");
        Page<ShippingDTO> page = shippingService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/shippings");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /shippings/:id : get the "id" shipping.
     *
     * @param id the id of the shippingDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the shippingDTO, or with status 404 (Not Found)
     */
    @GetMapping("/shippings/{id}")
    @Timed
    public ResponseEntity<ShippingDTO> getShipping(@PathVariable Long id) {
        log.debug("REST request to get Shipping : {}", id);
        ShippingDTO shippingDTO = shippingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(shippingDTO));
    }

    /**
     * DELETE  /shippings/:id : delete the "id" shipping.
     *
     * @param id the id of the shippingDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/shippings/{id}")
    @Timed
    public ResponseEntity<Void> deleteShipping(@PathVariable Long id) {
        log.debug("REST request to delete Shipping : {}", id);
        shippingService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/shippings?query=:query : search for the shipping corresponding
     * to the query.
     *
     * @param query the query of the shipping search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/shippings")
    @Timed
    public ResponseEntity<List<ShippingDTO>> searchShippings(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Shippings for query {}", query);
        Page<ShippingDTO> page = shippingService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/shippings");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
