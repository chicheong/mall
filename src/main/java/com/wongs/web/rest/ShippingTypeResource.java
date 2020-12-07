package com.wongs.web.rest;

import com.wongs.service.ShippingTypeService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.ShippingTypeDTO;

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
 * REST controller for managing {@link com.wongs.domain.ShippingType}.
 */
@RestController
@RequestMapping("/api")
public class ShippingTypeResource {

    private final Logger log = LoggerFactory.getLogger(ShippingTypeResource.class);

    private static final String ENTITY_NAME = "shippingType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShippingTypeService shippingTypeService;

    public ShippingTypeResource(ShippingTypeService shippingTypeService) {
        this.shippingTypeService = shippingTypeService;
    }

    /**
     * {@code POST  /shipping-types} : Create a new shippingType.
     *
     * @param shippingTypeDTO the shippingTypeDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shippingTypeDTO, or with status {@code 400 (Bad Request)} if the shippingType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shipping-types")
    public ResponseEntity<ShippingTypeDTO> createShippingType(@RequestBody ShippingTypeDTO shippingTypeDTO) throws URISyntaxException {
        log.debug("REST request to save ShippingType : {}", shippingTypeDTO);
        if (shippingTypeDTO.getId() != null) {
            throw new BadRequestAlertException("A new shippingType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShippingTypeDTO result = shippingTypeService.save(shippingTypeDTO);
        return ResponseEntity.created(new URI("/api/shipping-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shipping-types} : Updates an existing shippingType.
     *
     * @param shippingTypeDTO the shippingTypeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shippingTypeDTO,
     * or with status {@code 400 (Bad Request)} if the shippingTypeDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shippingTypeDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shipping-types")
    public ResponseEntity<ShippingTypeDTO> updateShippingType(@RequestBody ShippingTypeDTO shippingTypeDTO) throws URISyntaxException {
        log.debug("REST request to update ShippingType : {}", shippingTypeDTO);
        if (shippingTypeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ShippingTypeDTO result = shippingTypeService.save(shippingTypeDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shippingTypeDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /shipping-types} : get all the shippingTypes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shippingTypes in body.
     */
    @GetMapping("/shipping-types")
    public ResponseEntity<List<ShippingTypeDTO>> getAllShippingTypes(Pageable pageable) {
        log.debug("REST request to get a page of ShippingTypes");
        Page<ShippingTypeDTO> page = shippingTypeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /shipping-types/:id} : get the "id" shippingType.
     *
     * @param id the id of the shippingTypeDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shippingTypeDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shipping-types/{id}")
    public ResponseEntity<ShippingTypeDTO> getShippingType(@PathVariable Long id) {
        log.debug("REST request to get ShippingType : {}", id);
        Optional<ShippingTypeDTO> shippingTypeDTO = shippingTypeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(shippingTypeDTO);
    }

    /**
     * {@code DELETE  /shipping-types/:id} : delete the "id" shippingType.
     *
     * @param id the id of the shippingTypeDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/shipping-types/{id}")
    public ResponseEntity<Void> deleteShippingType(@PathVariable Long id) {
        log.debug("REST request to delete ShippingType : {}", id);
        shippingTypeService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/shipping-types?query=:query} : search for the shippingType corresponding
     * to the query.
     *
     * @param query the query of the shippingType search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/shipping-types")
    public ResponseEntity<List<ShippingTypeDTO>> searchShippingTypes(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ShippingTypes for query {}", query);
        Page<ShippingTypeDTO> page = shippingTypeService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
