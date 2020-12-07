package com.wongs.web.rest;

import com.wongs.domain.Product;
import com.wongs.permission.PermissionUtils;
import com.wongs.service.ProductService;
import com.wongs.service.ShopService;
import com.wongs.service.UrlService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.ShopDTO;
import com.wongs.service.mapper.UrlMapper;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

import org.apache.commons.lang3.StringUtils;
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
 * REST controller for managing {@link com.wongs.domain.Shop}.
 */
@RestController
@RequestMapping("/api")
public class ShopResource {

    private final Logger log = LoggerFactory.getLogger(ShopResource.class);

    private static final String ENTITY_NAME = "shop";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShopService shopService;
    private final ProductService productService;
    private final UrlService urlService;
    private final UrlMapper urlMapper;

    public ShopResource(ShopService shopService, ProductService productService, UrlService urlService,
    		UrlMapper urlMapper) {
        this.shopService = shopService;
        this.productService = productService;
        this.urlService = urlService;
        this.urlMapper = urlMapper;
    }

    /**
     * {@code POST  /shops} : Create a new shop.
     *
     * @param shopDTO the shopDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shopDTO, or with status {@code 400 (Bad Request)} if the shop has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shops")
    public ResponseEntity<ShopDTO> createShop(@Valid @RequestBody ShopDTO shopDTO) throws URISyntaxException {
        log.debug("REST request to save Shop : {}", shopDTO);
        if (shopDTO.getId() != null) {
            throw new BadRequestAlertException("A new shop cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShopDTO result = shopService.save(shopDTO);
        return ResponseEntity.created(new URI("/api/shops/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shops} : Updates an existing shop.
     *
     * @param shopDTO the shopDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shopDTO,
     * or with status {@code 400 (Bad Request)} if the shopDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shopDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shops")
    public ResponseEntity<ShopDTO> updateShop(@Valid @RequestBody ShopDTO shopDTO) throws URISyntaxException {
        log.debug("REST request to update Shop : {}", shopDTO);
        if (shopDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        // Check user permission
        if (!(PermissionUtils.isUpdatable(shopService.getPermission(shopDTO.getId()))))
        	throw new BadRequestAlertException("You do not have permssion to update a shop", ENTITY_NAME, "permission");
        
        ShopDTO result = shopService.save(shopDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shopDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /shops} : get all the shops.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shops in body.
     */
    @GetMapping("/shops")
    public ResponseEntity<List<ShopDTO>> getAllShops(Pageable pageable) {
        log.debug("REST request to get a page of Shops");
        Page<ShopDTO> page = shopService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /shops/:code : get the "code" shop.
     *
     * @param code the code of the shopDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the shopDTO, or with status 404 (Not Found)
     */
    @GetMapping("/shops/{code}")
    public ResponseEntity<ShopDTO> getShop(@PathVariable String code) {
        log.debug("REST request to get Shop : {}", code);
        ShopDTO shopDTO;
        if (StringUtils.isNumeric(code))
        	shopDTO = shopService.findOne(Long.valueOf(code)).orElse(null);
        else
        	shopDTO = shopService.findByCode(code);
        if (shopDTO != null) {
        	shopDTO.setProducts(productService.findByShopId(shopDTO.getId()));
        	shopDTO.getProducts().forEach((product) -> {
        		product.setUrls(urlMapper.toDto(urlService.findByEntityTypeAndEntityId(Product.class.getSimpleName(), product.getId())));
        	});
        }
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(shopDTO));
    }

    /**
     * {@code GET  /shops/:id} : get the "id" shop.
     *
     * @param id the id of the shopDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shopDTO, or with status {@code 404 (Not Found)}.
     */
//    @GetMapping("/shops/{id}")
//    public ResponseEntity<ShopDTO> getShop(@PathVariable Long id) {
//        log.debug("REST request to get Shop : {}", id);
//        Optional<ShopDTO> shopDTO = shopService.findOne(id);
//        return ResponseUtil.wrapOrNotFound(shopDTO);
//    }

    /**
     * {@code DELETE  /shops/:id} : delete the "id" shop.
     *
     * @param id the id of the shopDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/shops/{id}")
    public ResponseEntity<Void> deleteShop(@PathVariable Long id) {
        log.debug("REST request to delete Shop : {}", id);
        // Check user permission
        if (!(PermissionUtils.isDeletable(shopService.getPermission(id))))
        	throw new BadRequestAlertException("You do not have permssion to delete a shop", ENTITY_NAME, "permission");
        
        shopService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/shops?query=:query} : search for the shop corresponding
     * to the query.
     *
     * @param query the query of the shop search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/shops")
    public ResponseEntity<List<ShopDTO>> searchShops(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Shops for query {}", query);
        Page<ShopDTO> page = shopService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
