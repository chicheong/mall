package com.wongs.web.rest;

import com.wongs.service.OrderShopService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.OrderShopDTO;

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
 * REST controller for managing {@link com.wongs.domain.OrderShop}.
 */
@RestController
@RequestMapping("/api")
public class OrderShopResource {

    private final Logger log = LoggerFactory.getLogger(OrderShopResource.class);

    private static final String ENTITY_NAME = "orderShop";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderShopService orderShopService;

    public OrderShopResource(OrderShopService orderShopService) {
        this.orderShopService = orderShopService;
    }

    /**
     * {@code POST  /order-shops} : Create a new orderShop.
     *
     * @param orderShopDTO the orderShopDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderShopDTO, or with status {@code 400 (Bad Request)} if the orderShop has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/order-shops")
    public ResponseEntity<OrderShopDTO> createOrderShop(@RequestBody OrderShopDTO orderShopDTO) throws URISyntaxException {
        log.debug("REST request to save OrderShop : {}", orderShopDTO);
        if (orderShopDTO.getId() != null) {
            throw new BadRequestAlertException("A new orderShop cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrderShopDTO result = orderShopService.save(orderShopDTO);
        return ResponseEntity.created(new URI("/api/order-shops/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /order-shops} : Updates an existing orderShop.
     *
     * @param orderShopDTO the orderShopDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderShopDTO,
     * or with status {@code 400 (Bad Request)} if the orderShopDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderShopDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/order-shops")
    public ResponseEntity<OrderShopDTO> updateOrderShop(@RequestBody OrderShopDTO orderShopDTO) throws URISyntaxException {
        log.debug("REST request to update OrderShop : {}", orderShopDTO);
        if (orderShopDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        OrderShopDTO result = orderShopService.save(orderShopDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderShopDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /order-shops} : get all the orderShops.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderShops in body.
     */
    @GetMapping("/order-shops")
    public ResponseEntity<List<OrderShopDTO>> getAllOrderShops(Pageable pageable) {
        log.debug("REST request to get a page of OrderShops");
        Page<OrderShopDTO> page = orderShopService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /order-shops/:id} : get the "id" orderShop.
     *
     * @param id the id of the orderShopDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderShopDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/order-shops/{id}")
    public ResponseEntity<OrderShopDTO> getOrderShop(@PathVariable Long id) {
        log.debug("REST request to get OrderShop : {}", id);
        Optional<OrderShopDTO> orderShopDTO = orderShopService.findOne(id);
        return ResponseUtil.wrapOrNotFound(orderShopDTO);
    }

    /**
     * {@code DELETE  /order-shops/:id} : delete the "id" orderShop.
     *
     * @param id the id of the orderShopDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/order-shops/{id}")
    public ResponseEntity<Void> deleteOrderShop(@PathVariable Long id) {
        log.debug("REST request to delete OrderShop : {}", id);
        orderShopService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/order-shops?query=:query} : search for the orderShop corresponding
     * to the query.
     *
     * @param query the query of the orderShop search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/order-shops")
    public ResponseEntity<List<OrderShopDTO>> searchOrderShops(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of OrderShops for query {}", query);
        Page<OrderShopDTO> page = orderShopService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
