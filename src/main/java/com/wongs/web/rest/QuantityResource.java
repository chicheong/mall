package com.wongs.web.rest;

import com.wongs.service.QuantityService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.QuantityDTO;

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
 * REST controller for managing {@link com.wongs.domain.Quantity}.
 */
@RestController
@RequestMapping("/api")
public class QuantityResource {

    private final Logger log = LoggerFactory.getLogger(QuantityResource.class);

    private static final String ENTITY_NAME = "quantity";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QuantityService quantityService;

    public QuantityResource(QuantityService quantityService) {
        this.quantityService = quantityService;
    }

    /**
     * {@code POST  /quantities} : Create a new quantity.
     *
     * @param quantityDTO the quantityDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new quantityDTO, or with status {@code 400 (Bad Request)} if the quantity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/quantities")
    public ResponseEntity<QuantityDTO> createQuantity(@RequestBody QuantityDTO quantityDTO) throws URISyntaxException {
        log.debug("REST request to save Quantity : {}", quantityDTO);
        if (quantityDTO.getId() != null) {
            throw new BadRequestAlertException("A new quantity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        QuantityDTO result = quantityService.save(quantityDTO);
        return ResponseEntity.created(new URI("/api/quantities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /quantities} : Updates an existing quantity.
     *
     * @param quantityDTO the quantityDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated quantityDTO,
     * or with status {@code 400 (Bad Request)} if the quantityDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the quantityDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/quantities")
    public ResponseEntity<QuantityDTO> updateQuantity(@RequestBody QuantityDTO quantityDTO) throws URISyntaxException {
        log.debug("REST request to update Quantity : {}", quantityDTO);
        if (quantityDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        QuantityDTO result = quantityService.save(quantityDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, quantityDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /quantities} : get all the quantities.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of quantities in body.
     */
    @GetMapping("/quantities")
    public ResponseEntity<List<QuantityDTO>> getAllQuantities(Pageable pageable) {
        log.debug("REST request to get a page of Quantities");
        Page<QuantityDTO> page = quantityService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /quantities/:id} : get the "id" quantity.
     *
     * @param id the id of the quantityDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the quantityDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/quantities/{id}")
    public ResponseEntity<QuantityDTO> getQuantity(@PathVariable Long id) {
        log.debug("REST request to get Quantity : {}", id);
        Optional<QuantityDTO> quantityDTO = quantityService.findOne(id);
        return ResponseUtil.wrapOrNotFound(quantityDTO);
    }

    /**
     * {@code DELETE  /quantities/:id} : delete the "id" quantity.
     *
     * @param id the id of the quantityDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/quantities/{id}")
    public ResponseEntity<Void> deleteQuantity(@PathVariable Long id) {
        log.debug("REST request to delete Quantity : {}", id);
        quantityService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/quantities?query=:query} : search for the quantity corresponding
     * to the query.
     *
     * @param query the query of the quantity search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/quantities")
    public ResponseEntity<List<QuantityDTO>> searchQuantities(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Quantities for query {}", query);
        Page<QuantityDTO> page = quantityService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
