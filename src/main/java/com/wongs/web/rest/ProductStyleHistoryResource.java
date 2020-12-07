package com.wongs.web.rest;

import com.wongs.service.ProductStyleHistoryService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.ProductStyleHistoryDTO;

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
 * REST controller for managing {@link com.wongs.domain.ProductStyleHistory}.
 */
@RestController
@RequestMapping("/api")
public class ProductStyleHistoryResource {

    private final Logger log = LoggerFactory.getLogger(ProductStyleHistoryResource.class);

    private static final String ENTITY_NAME = "productStyleHistory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductStyleHistoryService productStyleHistoryService;

    public ProductStyleHistoryResource(ProductStyleHistoryService productStyleHistoryService) {
        this.productStyleHistoryService = productStyleHistoryService;
    }

    /**
     * {@code POST  /product-style-histories} : Create a new productStyleHistory.
     *
     * @param productStyleHistoryDTO the productStyleHistoryDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productStyleHistoryDTO, or with status {@code 400 (Bad Request)} if the productStyleHistory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-style-histories")
    public ResponseEntity<ProductStyleHistoryDTO> createProductStyleHistory(@RequestBody ProductStyleHistoryDTO productStyleHistoryDTO) throws URISyntaxException {
        log.debug("REST request to save ProductStyleHistory : {}", productStyleHistoryDTO);
        if (productStyleHistoryDTO.getId() != null) {
            throw new BadRequestAlertException("A new productStyleHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductStyleHistoryDTO result = productStyleHistoryService.save(productStyleHistoryDTO);
        return ResponseEntity.created(new URI("/api/product-style-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-style-histories} : Updates an existing productStyleHistory.
     *
     * @param productStyleHistoryDTO the productStyleHistoryDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productStyleHistoryDTO,
     * or with status {@code 400 (Bad Request)} if the productStyleHistoryDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productStyleHistoryDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-style-histories")
    public ResponseEntity<ProductStyleHistoryDTO> updateProductStyleHistory(@RequestBody ProductStyleHistoryDTO productStyleHistoryDTO) throws URISyntaxException {
        log.debug("REST request to update ProductStyleHistory : {}", productStyleHistoryDTO);
        if (productStyleHistoryDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductStyleHistoryDTO result = productStyleHistoryService.save(productStyleHistoryDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productStyleHistoryDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /product-style-histories} : get all the productStyleHistories.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productStyleHistories in body.
     */
    @GetMapping("/product-style-histories")
    public List<ProductStyleHistoryDTO> getAllProductStyleHistories() {
        log.debug("REST request to get all ProductStyleHistories");
        return productStyleHistoryService.findAll();
    }

    /**
     * {@code GET  /product-style-histories/:id} : get the "id" productStyleHistory.
     *
     * @param id the id of the productStyleHistoryDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productStyleHistoryDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-style-histories/{id}")
    public ResponseEntity<ProductStyleHistoryDTO> getProductStyleHistory(@PathVariable Long id) {
        log.debug("REST request to get ProductStyleHistory : {}", id);
        Optional<ProductStyleHistoryDTO> productStyleHistoryDTO = productStyleHistoryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(productStyleHistoryDTO);
    }

    /**
     * {@code DELETE  /product-style-histories/:id} : delete the "id" productStyleHistory.
     *
     * @param id the id of the productStyleHistoryDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-style-histories/{id}")
    public ResponseEntity<Void> deleteProductStyleHistory(@PathVariable Long id) {
        log.debug("REST request to delete ProductStyleHistory : {}", id);
        productStyleHistoryService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/product-style-histories?query=:query} : search for the productStyleHistory corresponding
     * to the query.
     *
     * @param query the query of the productStyleHistory search.
     * @return the result of the search.
     */
    @GetMapping("/_search/product-style-histories")
    public List<ProductStyleHistoryDTO> searchProductStyleHistories(@RequestParam String query) {
        log.debug("REST request to search ProductStyleHistories for query {}", query);
        return productStyleHistoryService.search(query);
    }
}
