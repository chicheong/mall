package com.wongs.web.rest;

import com.wongs.service.ProductHistoryService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.ProductHistoryDTO;

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

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.wongs.domain.ProductHistory}.
 */
@RestController
@RequestMapping("/api")
public class ProductHistoryResource {

    private final Logger log = LoggerFactory.getLogger(ProductHistoryResource.class);

    private static final String ENTITY_NAME = "productHistory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductHistoryService productHistoryService;

    public ProductHistoryResource(ProductHistoryService productHistoryService) {
        this.productHistoryService = productHistoryService;
    }

    /**
     * {@code POST  /product-histories} : Create a new productHistory.
     *
     * @param productHistoryDTO the productHistoryDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productHistoryDTO, or with status {@code 400 (Bad Request)} if the productHistory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-histories")
    public ResponseEntity<ProductHistoryDTO> createProductHistory(@Valid @RequestBody ProductHistoryDTO productHistoryDTO) throws URISyntaxException {
        log.debug("REST request to save ProductHistory : {}", productHistoryDTO);
        if (productHistoryDTO.getId() != null) {
            throw new BadRequestAlertException("A new productHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductHistoryDTO result = productHistoryService.save(productHistoryDTO);
        return ResponseEntity.created(new URI("/api/product-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-histories} : Updates an existing productHistory.
     *
     * @param productHistoryDTO the productHistoryDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productHistoryDTO,
     * or with status {@code 400 (Bad Request)} if the productHistoryDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productHistoryDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-histories")
    public ResponseEntity<ProductHistoryDTO> updateProductHistory(@Valid @RequestBody ProductHistoryDTO productHistoryDTO) throws URISyntaxException {
        log.debug("REST request to update ProductHistory : {}", productHistoryDTO);
        if (productHistoryDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductHistoryDTO result = productHistoryService.save(productHistoryDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productHistoryDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /product-histories} : get all the productHistories.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productHistories in body.
     */
    @GetMapping("/product-histories")
    public ResponseEntity<List<ProductHistoryDTO>> getAllProductHistories(Pageable pageable) {
        log.debug("REST request to get a page of ProductHistories");
        Page<ProductHistoryDTO> page = productHistoryService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /product-histories/:id} : get the "id" productHistory.
     *
     * @param id the id of the productHistoryDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productHistoryDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-histories/{id}")
    public ResponseEntity<ProductHistoryDTO> getProductHistory(@PathVariable Long id) {
        log.debug("REST request to get ProductHistory : {}", id);
        Optional<ProductHistoryDTO> productHistoryDTO = productHistoryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(productHistoryDTO);
    }

    /**
     * {@code DELETE  /product-histories/:id} : delete the "id" productHistory.
     *
     * @param id the id of the productHistoryDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-histories/{id}")
    public ResponseEntity<Void> deleteProductHistory(@PathVariable Long id) {
        log.debug("REST request to delete ProductHistory : {}", id);
        productHistoryService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/product-histories?query=:query} : search for the productHistory corresponding
     * to the query.
     *
     * @param query the query of the productHistory search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/product-histories")
    public ResponseEntity<List<ProductHistoryDTO>> searchProductHistories(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ProductHistories for query {}", query);
        Page<ProductHistoryDTO> page = productHistoryService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
