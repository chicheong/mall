package com.wongs.web.rest;

import com.wongs.service.ProductItemHistoryService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.ProductItemHistoryDTO;

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
 * REST controller for managing {@link com.wongs.domain.ProductItemHistory}.
 */
@RestController
@RequestMapping("/api")
public class ProductItemHistoryResource {

    private final Logger log = LoggerFactory.getLogger(ProductItemHistoryResource.class);

    private static final String ENTITY_NAME = "productItemHistory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductItemHistoryService productItemHistoryService;

    public ProductItemHistoryResource(ProductItemHistoryService productItemHistoryService) {
        this.productItemHistoryService = productItemHistoryService;
    }

    /**
     * {@code POST  /product-item-histories} : Create a new productItemHistory.
     *
     * @param productItemHistoryDTO the productItemHistoryDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productItemHistoryDTO, or with status {@code 400 (Bad Request)} if the productItemHistory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-item-histories")
    public ResponseEntity<ProductItemHistoryDTO> createProductItemHistory(@RequestBody ProductItemHistoryDTO productItemHistoryDTO) throws URISyntaxException {
        log.debug("REST request to save ProductItemHistory : {}", productItemHistoryDTO);
        if (productItemHistoryDTO.getId() != null) {
            throw new BadRequestAlertException("A new productItemHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductItemHistoryDTO result = productItemHistoryService.save(productItemHistoryDTO);
        return ResponseEntity.created(new URI("/api/product-item-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-item-histories} : Updates an existing productItemHistory.
     *
     * @param productItemHistoryDTO the productItemHistoryDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productItemHistoryDTO,
     * or with status {@code 400 (Bad Request)} if the productItemHistoryDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productItemHistoryDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-item-histories")
    public ResponseEntity<ProductItemHistoryDTO> updateProductItemHistory(@RequestBody ProductItemHistoryDTO productItemHistoryDTO) throws URISyntaxException {
        log.debug("REST request to update ProductItemHistory : {}", productItemHistoryDTO);
        if (productItemHistoryDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductItemHistoryDTO result = productItemHistoryService.save(productItemHistoryDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productItemHistoryDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /product-item-histories} : get all the productItemHistories.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productItemHistories in body.
     */
    @GetMapping("/product-item-histories")
    public ResponseEntity<List<ProductItemHistoryDTO>> getAllProductItemHistories(Pageable pageable) {
        log.debug("REST request to get a page of ProductItemHistories");
        Page<ProductItemHistoryDTO> page = productItemHistoryService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /product-item-histories/:id} : get the "id" productItemHistory.
     *
     * @param id the id of the productItemHistoryDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productItemHistoryDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-item-histories/{id}")
    public ResponseEntity<ProductItemHistoryDTO> getProductItemHistory(@PathVariable Long id) {
        log.debug("REST request to get ProductItemHistory : {}", id);
        Optional<ProductItemHistoryDTO> productItemHistoryDTO = productItemHistoryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(productItemHistoryDTO);
    }

    /**
     * {@code DELETE  /product-item-histories/:id} : delete the "id" productItemHistory.
     *
     * @param id the id of the productItemHistoryDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-item-histories/{id}")
    public ResponseEntity<Void> deleteProductItemHistory(@PathVariable Long id) {
        log.debug("REST request to delete ProductItemHistory : {}", id);
        productItemHistoryService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/product-item-histories?query=:query} : search for the productItemHistory corresponding
     * to the query.
     *
     * @param query the query of the productItemHistory search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/product-item-histories")
    public ResponseEntity<List<ProductItemHistoryDTO>> searchProductItemHistories(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ProductItemHistories for query {}", query);
        Page<ProductItemHistoryDTO> page = productItemHistoryService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
