package com.wongs.web.rest;

import com.wongs.service.ProductStyleService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.ProductStyleDTO;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.wongs.domain.ProductStyle}.
 */
@RestController
@RequestMapping("/api")
public class ProductStyleResource {

    private final Logger log = LoggerFactory.getLogger(ProductStyleResource.class);

    private static final String ENTITY_NAME = "productStyle";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductStyleService productStyleService;

    public ProductStyleResource(ProductStyleService productStyleService) {
        this.productStyleService = productStyleService;
    }

    /**
     * {@code POST  /product-styles} : Create a new productStyle.
     *
     * @param productStyleDTO the productStyleDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productStyleDTO, or with status {@code 400 (Bad Request)} if the productStyle has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-styles")
    public ResponseEntity<ProductStyleDTO> createProductStyle(@RequestBody ProductStyleDTO productStyleDTO) throws URISyntaxException {
        log.debug("REST request to save ProductStyle : {}", productStyleDTO);
        if (productStyleDTO.getId() != null) {
            throw new BadRequestAlertException("A new productStyle cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductStyleDTO result = productStyleService.save(productStyleDTO);
        return ResponseEntity.created(new URI("/api/product-styles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-styles} : Updates an existing productStyle.
     *
     * @param productStyleDTO the productStyleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productStyleDTO,
     * or with status {@code 400 (Bad Request)} if the productStyleDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productStyleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-styles")
    public ResponseEntity<ProductStyleDTO> updateProductStyle(@RequestBody ProductStyleDTO productStyleDTO) throws URISyntaxException {
        log.debug("REST request to update ProductStyle : {}", productStyleDTO);
        if (productStyleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductStyleDTO result = productStyleService.save(productStyleDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productStyleDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /product-styles} : get all the productStyles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productStyles in body.
     */
    @GetMapping("/product-styles")
    public List<ProductStyleDTO> getAllProductStyles() {
        log.debug("REST request to get all ProductStyles");
        return productStyleService.findAll();
    }

    /**
     * {@code GET  /product-styles/:id} : get the "id" productStyle.
     *
     * @param id the id of the productStyleDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productStyleDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-styles/{id}")
    public ResponseEntity<ProductStyleDTO> getProductStyle(@PathVariable Long id) {
        log.debug("REST request to get ProductStyle : {}", id);
        Optional<ProductStyleDTO> productStyleDTO = productStyleService.findOne(id);
        return ResponseUtil.wrapOrNotFound(productStyleDTO);
    }

    /**
     * {@code DELETE  /product-styles/:id} : delete the "id" productStyle.
     *
     * @param id the id of the productStyleDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-styles/{id}")
    public ResponseEntity<Void> deleteProductStyle(@PathVariable Long id) {
        log.debug("REST request to delete ProductStyle : {}", id);
        productStyleService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/product-styles?query=:query} : search for the productStyle corresponding
     * to the query.
     *
     * @param query the query of the productStyle search.
     * @return the result of the search.
     */
    @GetMapping("/_search/product-styles")
    public List<ProductStyleDTO> searchProductStyles(@RequestParam String query) {
        log.debug("REST request to search ProductStyles for query {}", query);
        return productStyleService.search(query);
    }
}
