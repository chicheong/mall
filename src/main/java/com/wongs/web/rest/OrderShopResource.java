package com.wongs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.wongs.domain.OrderShop;

import com.wongs.repository.OrderShopRepository;
import com.wongs.repository.search.OrderShopSearchRepository;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.web.rest.util.HeaderUtil;
import com.wongs.web.rest.util.PaginationUtil;
import com.wongs.service.dto.OrderShopDTO;
import com.wongs.service.mapper.OrderShopMapper;
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
 * REST controller for managing OrderShop.
 */
@RestController
@RequestMapping("/api")
public class OrderShopResource {

    private final Logger log = LoggerFactory.getLogger(OrderShopResource.class);

    private static final String ENTITY_NAME = "orderShop";

    private final OrderShopRepository orderShopRepository;

    private final OrderShopMapper orderShopMapper;

    private final OrderShopSearchRepository orderShopSearchRepository;

    public OrderShopResource(OrderShopRepository orderShopRepository, OrderShopMapper orderShopMapper, OrderShopSearchRepository orderShopSearchRepository) {
        this.orderShopRepository = orderShopRepository;
        this.orderShopMapper = orderShopMapper;
        this.orderShopSearchRepository = orderShopSearchRepository;
    }

    /**
     * POST  /order-shops : Create a new orderShop.
     *
     * @param orderShopDTO the orderShopDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new orderShopDTO, or with status 400 (Bad Request) if the orderShop has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/order-shops")
    @Timed
    public ResponseEntity<OrderShopDTO> createOrderShop(@RequestBody OrderShopDTO orderShopDTO) throws URISyntaxException {
        log.debug("REST request to save OrderShop : {}", orderShopDTO);
        if (orderShopDTO.getId() != null) {
            throw new BadRequestAlertException("A new orderShop cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrderShop orderShop = orderShopMapper.toEntity(orderShopDTO);
        orderShop = orderShopRepository.save(orderShop);
        OrderShopDTO result = orderShopMapper.toDto(orderShop);
        orderShopSearchRepository.save(orderShop);
        return ResponseEntity.created(new URI("/api/order-shops/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /order-shops : Updates an existing orderShop.
     *
     * @param orderShopDTO the orderShopDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated orderShopDTO,
     * or with status 400 (Bad Request) if the orderShopDTO is not valid,
     * or with status 500 (Internal Server Error) if the orderShopDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/order-shops")
    @Timed
    public ResponseEntity<OrderShopDTO> updateOrderShop(@RequestBody OrderShopDTO orderShopDTO) throws URISyntaxException {
        log.debug("REST request to update OrderShop : {}", orderShopDTO);
        if (orderShopDTO.getId() == null) {
            return createOrderShop(orderShopDTO);
        }
        OrderShop orderShop = orderShopMapper.toEntity(orderShopDTO);
        orderShop = orderShopRepository.save(orderShop);
        OrderShopDTO result = orderShopMapper.toDto(orderShop);
        orderShopSearchRepository.save(orderShop);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, orderShopDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /order-shops : get all the orderShops.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of orderShops in body
     */
    @GetMapping("/order-shops")
    @Timed
    public ResponseEntity<List<OrderShopDTO>> getAllOrderShops(Pageable pageable) {
        log.debug("REST request to get a page of OrderShops");
        Page<OrderShop> page = orderShopRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/order-shops");
        return new ResponseEntity<>(orderShopMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /order-shops/:id : get the "id" orderShop.
     *
     * @param id the id of the orderShopDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the orderShopDTO, or with status 404 (Not Found)
     */
    @GetMapping("/order-shops/{id}")
    @Timed
    public ResponseEntity<OrderShopDTO> getOrderShop(@PathVariable Long id) {
        log.debug("REST request to get OrderShop : {}", id);
        OrderShop orderShop = orderShopRepository.findOne(id);
        OrderShopDTO orderShopDTO = orderShopMapper.toDto(orderShop);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(orderShopDTO));
    }

    /**
     * DELETE  /order-shops/:id : delete the "id" orderShop.
     *
     * @param id the id of the orderShopDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/order-shops/{id}")
    @Timed
    public ResponseEntity<Void> deleteOrderShop(@PathVariable Long id) {
        log.debug("REST request to delete OrderShop : {}", id);
        orderShopRepository.delete(id);
        orderShopSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/order-shops?query=:query : search for the orderShop corresponding
     * to the query.
     *
     * @param query the query of the orderShop search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/order-shops")
    @Timed
    public ResponseEntity<List<OrderShopDTO>> searchOrderShops(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of OrderShops for query {}", query);
        Page<OrderShop> page = orderShopSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/order-shops");
        return new ResponseEntity<>(orderShopMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

}
