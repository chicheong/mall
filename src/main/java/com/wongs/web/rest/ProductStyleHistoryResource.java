package com.wongs.web.rest;
import com.wongs.domain.ProductStyleHistory;
import com.wongs.repository.ProductStyleHistoryRepository;
import com.wongs.repository.search.ProductStyleHistorySearchRepository;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
 * REST controller for managing ProductStyleHistory.
 */
@RestController
@RequestMapping("/api")
public class ProductStyleHistoryResource {

    private final Logger log = LoggerFactory.getLogger(ProductStyleHistoryResource.class);

    private static final String ENTITY_NAME = "productStyleHistory";

    private final ProductStyleHistoryRepository productStyleHistoryRepository;

    private final ProductStyleHistorySearchRepository productStyleHistorySearchRepository;

    public ProductStyleHistoryResource(ProductStyleHistoryRepository productStyleHistoryRepository, ProductStyleHistorySearchRepository productStyleHistorySearchRepository) {
        this.productStyleHistoryRepository = productStyleHistoryRepository;
        this.productStyleHistorySearchRepository = productStyleHistorySearchRepository;
    }

    /**
     * POST  /product-style-histories : Create a new productStyleHistory.
     *
     * @param productStyleHistory the productStyleHistory to create
     * @return the ResponseEntity with status 201 (Created) and with body the new productStyleHistory, or with status 400 (Bad Request) if the productStyleHistory has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/product-style-histories")
    public ResponseEntity<ProductStyleHistory> createProductStyleHistory(@RequestBody ProductStyleHistory productStyleHistory) throws URISyntaxException {
        log.debug("REST request to save ProductStyleHistory : {}", productStyleHistory);
        if (productStyleHistory.getId() != null) {
            throw new BadRequestAlertException("A new productStyleHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductStyleHistory result = productStyleHistoryRepository.save(productStyleHistory);
        productStyleHistorySearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/product-style-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /product-style-histories : Updates an existing productStyleHistory.
     *
     * @param productStyleHistory the productStyleHistory to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated productStyleHistory,
     * or with status 400 (Bad Request) if the productStyleHistory is not valid,
     * or with status 500 (Internal Server Error) if the productStyleHistory couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/product-style-histories")
    public ResponseEntity<ProductStyleHistory> updateProductStyleHistory(@RequestBody ProductStyleHistory productStyleHistory) throws URISyntaxException {
        log.debug("REST request to update ProductStyleHistory : {}", productStyleHistory);
        if (productStyleHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductStyleHistory result = productStyleHistoryRepository.save(productStyleHistory);
        productStyleHistorySearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, productStyleHistory.getId().toString()))
            .body(result);
    }

    /**
     * GET  /product-style-histories : get all the productStyleHistories.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of productStyleHistories in body
     */
    @GetMapping("/product-style-histories")
    public List<ProductStyleHistory> getAllProductStyleHistories() {
        log.debug("REST request to get all ProductStyleHistories");
        return productStyleHistoryRepository.findAll();
    }

    /**
     * GET  /product-style-histories/:id : get the "id" productStyleHistory.
     *
     * @param id the id of the productStyleHistory to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the productStyleHistory, or with status 404 (Not Found)
     */
    @GetMapping("/product-style-histories/{id}")
    public ResponseEntity<ProductStyleHistory> getProductStyleHistory(@PathVariable Long id) {
        log.debug("REST request to get ProductStyleHistory : {}", id);
        Optional<ProductStyleHistory> productStyleHistory = productStyleHistoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productStyleHistory);
    }

    /**
     * DELETE  /product-style-histories/:id : delete the "id" productStyleHistory.
     *
     * @param id the id of the productStyleHistory to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/product-style-histories/{id}")
    public ResponseEntity<Void> deleteProductStyleHistory(@PathVariable Long id) {
        log.debug("REST request to delete ProductStyleHistory : {}", id);
        productStyleHistoryRepository.deleteById(id);
        productStyleHistorySearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/product-style-histories?query=:query : search for the productStyleHistory corresponding
     * to the query.
     *
     * @param query the query of the productStyleHistory search
     * @return the result of the search
     */
    @GetMapping("/_search/product-style-histories")
    public List<ProductStyleHistory> searchProductStyleHistories(@RequestParam String query) {
        log.debug("REST request to search ProductStyleHistories for query {}", query);
        return StreamSupport
            .stream(productStyleHistorySearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
