package com.wongs.web.rest;
import com.wongs.domain.OrderStatusHistory;
import com.wongs.repository.OrderStatusHistoryRepository;
import com.wongs.repository.search.OrderStatusHistorySearchRepository;
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

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing OrderStatusHistory.
 */
@RestController
@RequestMapping("/api")
public class OrderStatusHistoryResource {

    private final Logger log = LoggerFactory.getLogger(OrderStatusHistoryResource.class);

    private static final String ENTITY_NAME = "orderStatusHistory";

    private final OrderStatusHistoryRepository orderStatusHistoryRepository;

    private final OrderStatusHistorySearchRepository orderStatusHistorySearchRepository;

    public OrderStatusHistoryResource(OrderStatusHistoryRepository orderStatusHistoryRepository, OrderStatusHistorySearchRepository orderStatusHistorySearchRepository) {
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.orderStatusHistorySearchRepository = orderStatusHistorySearchRepository;
    }

    /**
     * POST  /order-status-histories : Create a new orderStatusHistory.
     *
     * @param orderStatusHistory the orderStatusHistory to create
     * @return the ResponseEntity with status 201 (Created) and with body the new orderStatusHistory, or with status 400 (Bad Request) if the orderStatusHistory has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/order-status-histories")
    public ResponseEntity<OrderStatusHistory> createOrderStatusHistory(@RequestBody OrderStatusHistory orderStatusHistory) throws URISyntaxException {
        log.debug("REST request to save OrderStatusHistory : {}", orderStatusHistory);
        if (orderStatusHistory.getId() != null) {
            throw new BadRequestAlertException("A new orderStatusHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrderStatusHistory result = orderStatusHistoryRepository.save(orderStatusHistory);
        orderStatusHistorySearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/order-status-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /order-status-histories : Updates an existing orderStatusHistory.
     *
     * @param orderStatusHistory the orderStatusHistory to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated orderStatusHistory,
     * or with status 400 (Bad Request) if the orderStatusHistory is not valid,
     * or with status 500 (Internal Server Error) if the orderStatusHistory couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/order-status-histories")
    public ResponseEntity<OrderStatusHistory> updateOrderStatusHistory(@RequestBody OrderStatusHistory orderStatusHistory) throws URISyntaxException {
        log.debug("REST request to update OrderStatusHistory : {}", orderStatusHistory);
        if (orderStatusHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        OrderStatusHistory result = orderStatusHistoryRepository.save(orderStatusHistory);
        orderStatusHistorySearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, orderStatusHistory.getId().toString()))
            .body(result);
    }

    /**
     * GET  /order-status-histories : get all the orderStatusHistories.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of orderStatusHistories in body
     */
    @GetMapping("/order-status-histories")
    public ResponseEntity<List<OrderStatusHistory>> getAllOrderStatusHistories(Pageable pageable) {
        log.debug("REST request to get a page of OrderStatusHistories");
        Page<OrderStatusHistory> page = orderStatusHistoryRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/order-status-histories");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /order-status-histories/:id : get the "id" orderStatusHistory.
     *
     * @param id the id of the orderStatusHistory to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the orderStatusHistory, or with status 404 (Not Found)
     */
    @GetMapping("/order-status-histories/{id}")
    public ResponseEntity<OrderStatusHistory> getOrderStatusHistory(@PathVariable Long id) {
        log.debug("REST request to get OrderStatusHistory : {}", id);
        Optional<OrderStatusHistory> orderStatusHistory = orderStatusHistoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(orderStatusHistory);
    }

    /**
     * DELETE  /order-status-histories/:id : delete the "id" orderStatusHistory.
     *
     * @param id the id of the orderStatusHistory to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/order-status-histories/{id}")
    public ResponseEntity<Void> deleteOrderStatusHistory(@PathVariable Long id) {
        log.debug("REST request to delete OrderStatusHistory : {}", id);
        orderStatusHistoryRepository.deleteById(id);
        orderStatusHistorySearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/order-status-histories?query=:query : search for the orderStatusHistory corresponding
     * to the query.
     *
     * @param query the query of the orderStatusHistory search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/order-status-histories")
    public ResponseEntity<List<OrderStatusHistory>> searchOrderStatusHistories(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of OrderStatusHistories for query {}", query);
        Page<OrderStatusHistory> page = orderStatusHistorySearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/order-status-histories");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
