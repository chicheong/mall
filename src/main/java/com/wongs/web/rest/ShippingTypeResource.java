package com.wongs.web.rest;
import com.wongs.domain.ShippingType;
import com.wongs.repository.ShippingTypeRepository;
import com.wongs.repository.search.ShippingTypeSearchRepository;
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
 * REST controller for managing ShippingType.
 */
@RestController
@RequestMapping("/api")
public class ShippingTypeResource {

    private final Logger log = LoggerFactory.getLogger(ShippingTypeResource.class);

    private static final String ENTITY_NAME = "shippingType";

    private final ShippingTypeRepository shippingTypeRepository;

    private final ShippingTypeSearchRepository shippingTypeSearchRepository;

    public ShippingTypeResource(ShippingTypeRepository shippingTypeRepository, ShippingTypeSearchRepository shippingTypeSearchRepository) {
        this.shippingTypeRepository = shippingTypeRepository;
        this.shippingTypeSearchRepository = shippingTypeSearchRepository;
    }

    /**
     * POST  /shipping-types : Create a new shippingType.
     *
     * @param shippingType the shippingType to create
     * @return the ResponseEntity with status 201 (Created) and with body the new shippingType, or with status 400 (Bad Request) if the shippingType has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/shipping-types")
    public ResponseEntity<ShippingType> createShippingType(@RequestBody ShippingType shippingType) throws URISyntaxException {
        log.debug("REST request to save ShippingType : {}", shippingType);
        if (shippingType.getId() != null) {
            throw new BadRequestAlertException("A new shippingType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShippingType result = shippingTypeRepository.save(shippingType);
        shippingTypeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/shipping-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /shipping-types : Updates an existing shippingType.
     *
     * @param shippingType the shippingType to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated shippingType,
     * or with status 400 (Bad Request) if the shippingType is not valid,
     * or with status 500 (Internal Server Error) if the shippingType couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/shipping-types")
    public ResponseEntity<ShippingType> updateShippingType(@RequestBody ShippingType shippingType) throws URISyntaxException {
        log.debug("REST request to update ShippingType : {}", shippingType);
        if (shippingType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ShippingType result = shippingTypeRepository.save(shippingType);
        shippingTypeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, shippingType.getId().toString()))
            .body(result);
    }

    /**
     * GET  /shipping-types : get all the shippingTypes.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of shippingTypes in body
     */
    @GetMapping("/shipping-types")
    public ResponseEntity<List<ShippingType>> getAllShippingTypes(Pageable pageable) {
        log.debug("REST request to get a page of ShippingTypes");
        Page<ShippingType> page = shippingTypeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/shipping-types");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /shipping-types/:id : get the "id" shippingType.
     *
     * @param id the id of the shippingType to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the shippingType, or with status 404 (Not Found)
     */
    @GetMapping("/shipping-types/{id}")
    public ResponseEntity<ShippingType> getShippingType(@PathVariable Long id) {
        log.debug("REST request to get ShippingType : {}", id);
        Optional<ShippingType> shippingType = shippingTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(shippingType);
    }

    /**
     * DELETE  /shipping-types/:id : delete the "id" shippingType.
     *
     * @param id the id of the shippingType to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/shipping-types/{id}")
    public ResponseEntity<Void> deleteShippingType(@PathVariable Long id) {
        log.debug("REST request to delete ShippingType : {}", id);
        shippingTypeRepository.deleteById(id);
        shippingTypeSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/shipping-types?query=:query : search for the shippingType corresponding
     * to the query.
     *
     * @param query the query of the shippingType search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/shipping-types")
    public ResponseEntity<List<ShippingType>> searchShippingTypes(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ShippingTypes for query {}", query);
        Page<ShippingType> page = shippingTypeSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/shipping-types");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
