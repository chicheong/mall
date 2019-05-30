package com.wongs.web.rest;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wongs.domain.ProductItem;
import com.wongs.repository.ProductItemRepository;
import com.wongs.repository.search.ProductItemSearchRepository;
import com.wongs.service.dto.ProductItemDTO;
import com.wongs.service.mapper.PriceMapper;
import com.wongs.service.mapper.ProductItemMapper;
import com.wongs.service.mapper.QuantityMapper;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.web.rest.util.HeaderUtil;
import com.wongs.web.rest.util.PaginationUtil;

import io.github.jhipster.web.util.ResponseUtil;

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
    private final PriceMapper priceMapper;
    private final QuantityMapper quantityMapper;
    
    private final ProductItemSearchRepository productItemSearchRepository;

    public ProductItemResource(ProductItemMapper productItemMapper, PriceMapper priceMapper, QuantityMapper quantityMapper,
    		ProductItemRepository productItemRepository, ProductItemSearchRepository productItemSearchRepository) {
    	this.productItemMapper = productItemMapper;
    	this.priceMapper = priceMapper;
        this.quantityMapper = quantityMapper;
    	this.productItemRepository = productItemRepository;
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
    public ResponseEntity<ProductItemDTO> updateProductItem(@RequestBody ProductItemDTO productItemDTO) throws URISyntaxException {
        log.debug("REST request to update ProductItem : {}", productItemDTO);
        if (productItemDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
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
     * @param filter the filter of the request
     * @return the ResponseEntity with status 200 (OK) and the list of productItems in body
     */
    @GetMapping("/product-items")
    public ResponseEntity<List<ProductItemDTO>> getAllProductItems(Pageable pageable, @RequestParam(required = false) String filter) {
        if ("color-is-null".equals(filter)) {
            log.debug("REST request to get all ProductItems where color is null");
            return new ResponseEntity<>(StreamSupport
                .stream(productItemRepository.findAll().spliterator(), false)
                .filter(productItem -> productItem.getColor() == null)
                .map(productItemMapper::toDto)
                .collect(Collectors.toList()), HttpStatus.OK);
        }
        if ("size-is-null".equals(filter)) {
            log.debug("REST request to get all ProductItems where size is null");
            return new ResponseEntity<>(StreamSupport
                .stream(productItemRepository.findAll().spliterator(), false)
                .filter(productItem -> productItem.getSize() == null)
                .map(productItemMapper::toDto)
                .collect(Collectors.toList()), HttpStatus.OK);
        }
        log.debug("REST request to get a page of ProductItems");
        Page<ProductItemDTO> page = productItemRepository.findAll(pageable).map(productItemMapper::toDto);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/product-items");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /product-items/:id : get the "id" productItem.
     *
     * @param id the id of the productItemDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the productItemDTO, or with status 404 (Not Found)
     */
    @GetMapping("/product-items/{id}")
    public ResponseEntity<ProductItemDTO> getProductItem(@PathVariable Long id) {
        log.debug("REST request to get ProductItem : {}", id);
//        Optional<ProductItemDTO> productItemDTO = productItemRepository.findById(id)
//            .map(productItemMapper::toDto);
        ProductItem productItem = productItemRepository.findOneWithEagerRelationships(id);
        ProductItemDTO productItemDTO = productItemMapper.toDto(productItem);
        productItemDTO.setPrices(priceMapper.toDto(productItem.getPrices()));
        productItemDTO.setQuantities(quantityMapper.toDto(productItem.getQuantities()));
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(productItemDTO));
    }

    /**
     * DELETE  /product-items/:id : delete the "id" productItem.
     *
     * @param id the id of the productItemDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/product-items/{id}")
    public ResponseEntity<Void> deleteProductItem(@PathVariable Long id) {
        log.debug("REST request to delete ProductItem : {}", id);
        productItemRepository.deleteById(id);
        productItemSearchRepository.deleteById(id);
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
    public ResponseEntity<List<ProductItemDTO>> searchProductItems(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ProductItems for query {}", query);
        Page<ProductItem> page = productItemSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/product-items");
        return ResponseEntity.ok().headers(headers).body(productItemMapper.toDto(page.getContent()));
    }

}
