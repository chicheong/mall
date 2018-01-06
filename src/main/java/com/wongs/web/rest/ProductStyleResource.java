package com.wongs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.wongs.domain.ProductStyle;

import com.wongs.repository.ProductStyleRepository;
import com.wongs.repository.search.ProductStyleSearchRepository;
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
 * REST controller for managing ProductStyle.
 */
@RestController
@RequestMapping("/api")
public class ProductStyleResource {

    private final Logger log = LoggerFactory.getLogger(ProductStyleResource.class);

    private static final String ENTITY_NAME = "productStyle";

    private final ProductStyleRepository productStyleRepository;

    private final ProductStyleSearchRepository productStyleSearchRepository;

    public ProductStyleResource(ProductStyleRepository productStyleRepository, ProductStyleSearchRepository productStyleSearchRepository) {
        this.productStyleRepository = productStyleRepository;
        this.productStyleSearchRepository = productStyleSearchRepository;
    }

    /**
     * POST  /product-styles : Create a new productStyle.
     *
     * @param productStyle the productStyle to create
     * @return the ResponseEntity with status 201 (Created) and with body the new productStyle, or with status 400 (Bad Request) if the productStyle has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/product-styles")
    @Timed
    public ResponseEntity<ProductStyle> createProductStyle(@RequestBody ProductStyle productStyle) throws URISyntaxException {
        log.debug("REST request to save ProductStyle : {}", productStyle);
        if (productStyle.getId() != null) {
            throw new BadRequestAlertException("A new productStyle cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductStyle result = productStyleRepository.save(productStyle);
        productStyleSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/product-styles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /product-styles : Updates an existing productStyle.
     *
     * @param productStyle the productStyle to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated productStyle,
     * or with status 400 (Bad Request) if the productStyle is not valid,
     * or with status 500 (Internal Server Error) if the productStyle couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/product-styles")
    @Timed
    public ResponseEntity<ProductStyle> updateProductStyle(@RequestBody ProductStyle productStyle) throws URISyntaxException {
        log.debug("REST request to update ProductStyle : {}", productStyle);
        if (productStyle.getId() == null) {
            return createProductStyle(productStyle);
        }
        ProductStyle result = productStyleRepository.save(productStyle);
        productStyleSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, productStyle.getId().toString()))
            .body(result);
    }

    /**
     * GET  /product-styles : get all the productStyles.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of productStyles in body
     */
    @GetMapping("/product-styles")
    @Timed
    public List<ProductStyle> getAllProductStyles() {
        log.debug("REST request to get all ProductStyles");
        return productStyleRepository.findAll();
        }

    /**
     * GET  /product-styles/:id : get the "id" productStyle.
     *
     * @param id the id of the productStyle to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the productStyle, or with status 404 (Not Found)
     */
    @GetMapping("/product-styles/{id}")
    @Timed
    public ResponseEntity<ProductStyle> getProductStyle(@PathVariable Long id) {
        log.debug("REST request to get ProductStyle : {}", id);
        ProductStyle productStyle = productStyleRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(productStyle));
    }

    /**
     * DELETE  /product-styles/:id : delete the "id" productStyle.
     *
     * @param id the id of the productStyle to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/product-styles/{id}")
    @Timed
    public ResponseEntity<Void> deleteProductStyle(@PathVariable Long id) {
        log.debug("REST request to delete ProductStyle : {}", id);
        productStyleRepository.delete(id);
        productStyleSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/product-styles?query=:query : search for the productStyle corresponding
     * to the query.
     *
     * @param query the query of the productStyle search
     * @return the result of the search
     */
    @GetMapping("/_search/product-styles")
    @Timed
    public List<ProductStyle> searchProductStyles(@RequestParam String query) {
        log.debug("REST request to search ProductStyles for query {}", query);
        return StreamSupport
            .stream(productStyleSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}