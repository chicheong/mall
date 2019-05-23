package com.wongs.web.rest;
import com.wongs.domain.ProductHistory;
import com.wongs.repository.ProductHistoryRepository;
import com.wongs.repository.search.ProductHistorySearchRepository;
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

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing ProductHistory.
 */
@RestController
@RequestMapping("/api")
public class ProductHistoryResource {

    private final Logger log = LoggerFactory.getLogger(ProductHistoryResource.class);

    private static final String ENTITY_NAME = "productHistory";

    private final ProductHistoryRepository productHistoryRepository;

    private final ProductHistorySearchRepository productHistorySearchRepository;

    public ProductHistoryResource(ProductHistoryRepository productHistoryRepository, ProductHistorySearchRepository productHistorySearchRepository) {
        this.productHistoryRepository = productHistoryRepository;
        this.productHistorySearchRepository = productHistorySearchRepository;
    }

    /**
     * POST  /product-histories : Create a new productHistory.
     *
     * @param productHistory the productHistory to create
     * @return the ResponseEntity with status 201 (Created) and with body the new productHistory, or with status 400 (Bad Request) if the productHistory has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/product-histories")
    public ResponseEntity<ProductHistory> createProductHistory(@Valid @RequestBody ProductHistory productHistory) throws URISyntaxException {
        log.debug("REST request to save ProductHistory : {}", productHistory);
        if (productHistory.getId() != null) {
            throw new BadRequestAlertException("A new productHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductHistory result = productHistoryRepository.save(productHistory);
        productHistorySearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/product-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /product-histories : Updates an existing productHistory.
     *
     * @param productHistory the productHistory to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated productHistory,
     * or with status 400 (Bad Request) if the productHistory is not valid,
     * or with status 500 (Internal Server Error) if the productHistory couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/product-histories")
    public ResponseEntity<ProductHistory> updateProductHistory(@Valid @RequestBody ProductHistory productHistory) throws URISyntaxException {
        log.debug("REST request to update ProductHistory : {}", productHistory);
        if (productHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductHistory result = productHistoryRepository.save(productHistory);
        productHistorySearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, productHistory.getId().toString()))
            .body(result);
    }

    /**
     * GET  /product-histories : get all the productHistories.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of productHistories in body
     */
    @GetMapping("/product-histories")
    public ResponseEntity<List<ProductHistory>> getAllProductHistories(Pageable pageable) {
        log.debug("REST request to get a page of ProductHistories");
        Page<ProductHistory> page = productHistoryRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/product-histories");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /product-histories/:id : get the "id" productHistory.
     *
     * @param id the id of the productHistory to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the productHistory, or with status 404 (Not Found)
     */
    @GetMapping("/product-histories/{id}")
    public ResponseEntity<ProductHistory> getProductHistory(@PathVariable Long id) {
        log.debug("REST request to get ProductHistory : {}", id);
        Optional<ProductHistory> productHistory = productHistoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productHistory);
    }

    /**
     * DELETE  /product-histories/:id : delete the "id" productHistory.
     *
     * @param id the id of the productHistory to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/product-histories/{id}")
    public ResponseEntity<Void> deleteProductHistory(@PathVariable Long id) {
        log.debug("REST request to delete ProductHistory : {}", id);
        productHistoryRepository.deleteById(id);
        productHistorySearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/product-histories?query=:query : search for the productHistory corresponding
     * to the query.
     *
     * @param query the query of the productHistory search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/product-histories")
    public ResponseEntity<List<ProductHistory>> searchProductHistories(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ProductHistories for query {}", query);
        Page<ProductHistory> page = productHistorySearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/product-histories");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
