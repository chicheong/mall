package com.wongs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.wongs.domain.ProductItem;

import com.wongs.repository.ProductItemRepository;
import com.wongs.repository.search.ProductItemSearchRepository;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.web.rest.util.HeaderUtil;
import com.wongs.web.rest.util.PaginationUtil;
import com.wongs.service.dto.ProductItemDTO;
import com.wongs.service.mapper.ProductItemMapper;
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
 * REST controller for managing ProductItem.
 */
@RestController
@RequestMapping("/api")
public class ProductItemResource {

    private final Logger log = LoggerFactory.getLogger(ProductItemResource.class);

    private static final String ENTITY_NAME = "productItem";

    private final ProductItemRepository productItemRepository;

    private final ProductItemMapper productItemMapper;

    private final ProductItemSearchRepository productItemSearchRepository;

    public ProductItemResource(ProductItemRepository productItemRepository, ProductItemMapper productItemMapper, ProductItemSearchRepository productItemSearchRepository) {
        this.productItemRepository = productItemRepository;
        this.productItemMapper = productItemMapper;
        this.productItemSearchRepository = productItemSearchRepository;
    }

    /**
     * POST  /product-items : Create a new productItem.
     *
     * @param productItemDTO the productItemDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new productItemDTO, or with status 400 (Bad Request) if the productItem has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/product-items")
    @Timed
    public ResponseEntity<ProductItemDTO> createProductItem(@RequestBody ProductItemDTO productItemDTO) throws URISyntaxException {
        log.debug("REST request to save ProductItem : {}", productItemDTO);
        if (productItemDTO.getId() != null) {
            throw new BadRequestAlertException("A new productItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductItem productItem = productItemMapper.toEntity(productItemDTO);
        productItem = productItemRepository.save(productItem);
        ProductItemDTO result = productItemMapper.toDto(productItem);
        productItemSearchRepository.save(productItem);
        return ResponseEntity.created(new URI("/api/product-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /product-items : Updates an existing productItem.
     *
     * @param productItemDTO the productItemDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated productItemDTO,
     * or with status 400 (Bad Request) if the productItemDTO is not valid,
     * or with status 500 (Internal Server Error) if the productItemDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/product-items")
    @Timed
    public ResponseEntity<ProductItemDTO> updateProductItem(@RequestBody ProductItemDTO productItemDTO) throws URISyntaxException {
        log.debug("REST request to update ProductItem : {}", productItemDTO);
        if (productItemDTO.getId() == null) {
            return createProductItem(productItemDTO);
        }
        ProductItem productItem = productItemMapper.toEntity(productItemDTO);
        productItem = productItemRepository.save(productItem);
        ProductItemDTO result = productItemMapper.toDto(productItem);
        productItemSearchRepository.save(productItem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, productItemDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /product-items : get all the productItems.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of productItems in body
     */
    @GetMapping("/product-items")
    @Timed
    public ResponseEntity<List<ProductItemDTO>> getAllProductItems(Pageable pageable) {
        log.debug("REST request to get a page of ProductItems");
        Page<ProductItem> page = productItemRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/product-items");
        return new ResponseEntity<>(productItemMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /product-items/:id : get the "id" productItem.
     *
     * @param id the id of the productItemDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the productItemDTO, or with status 404 (Not Found)
     */
    @GetMapping("/product-items/{id}")
    @Timed
    public ResponseEntity<ProductItemDTO> getProductItem(@PathVariable Long id) {
        log.debug("REST request to get ProductItem : {}", id);
        ProductItem productItem = productItemRepository.findOne(id);
        ProductItemDTO productItemDTO = productItemMapper.toDto(productItem);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(productItemDTO));
    }

    /**
     * DELETE  /product-items/:id : delete the "id" productItem.
     *
     * @param id the id of the productItemDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/product-items/{id}")
    @Timed
    public ResponseEntity<Void> deleteProductItem(@PathVariable Long id) {
        log.debug("REST request to delete ProductItem : {}", id);
        productItemRepository.delete(id);
        productItemSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/product-items?query=:query : search for the productItem corresponding
     * to the query.
     *
     * @param query the query of the productItem search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/product-items")
    @Timed
    public ResponseEntity<List<ProductItemDTO>> searchProductItems(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ProductItems for query {}", query);
        Page<ProductItem> page = productItemSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/product-items");
        return new ResponseEntity<>(productItemMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

}
