package com.wongs.web.rest;

import com.wongs.service.OrderStatusHistoryService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.OrderStatusHistoryDTO;

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
 * REST controller for managing {@link com.wongs.domain.OrderStatusHistory}.
 */
@RestController
@RequestMapping("/api")
public class OrderStatusHistoryResource {

    private final Logger log = LoggerFactory.getLogger(OrderStatusHistoryResource.class);

    private static final String ENTITY_NAME = "orderStatusHistory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderStatusHistoryService orderStatusHistoryService;

    public OrderStatusHistoryResource(OrderStatusHistoryService orderStatusHistoryService) {
        this.orderStatusHistoryService = orderStatusHistoryService;
    }

    /**
     * {@code POST  /order-status-histories} : Create a new orderStatusHistory.
     *
     * @param orderStatusHistoryDTO the orderStatusHistoryDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderStatusHistoryDTO, or with status {@code 400 (Bad Request)} if the orderStatusHistory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/order-status-histories")
    public ResponseEntity<OrderStatusHistoryDTO> createOrderStatusHistory(@RequestBody OrderStatusHistoryDTO orderStatusHistoryDTO) throws URISyntaxException {
        log.debug("REST request to save OrderStatusHistory : {}", orderStatusHistoryDTO);
        if (orderStatusHistoryDTO.getId() != null) {
            throw new BadRequestAlertException("A new orderStatusHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrderStatusHistoryDTO result = orderStatusHistoryService.save(orderStatusHistoryDTO);
        return ResponseEntity.created(new URI("/api/order-status-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /order-status-histories} : Updates an existing orderStatusHistory.
     *
     * @param orderStatusHistoryDTO the orderStatusHistoryDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderStatusHistoryDTO,
     * or with status {@code 400 (Bad Request)} if the orderStatusHistoryDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderStatusHistoryDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/order-status-histories")
    public ResponseEntity<OrderStatusHistoryDTO> updateOrderStatusHistory(@RequestBody OrderStatusHistoryDTO orderStatusHistoryDTO) throws URISyntaxException {
        log.debug("REST request to update OrderStatusHistory : {}", orderStatusHistoryDTO);
        if (orderStatusHistoryDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        OrderStatusHistoryDTO result = orderStatusHistoryService.save(orderStatusHistoryDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderStatusHistoryDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /order-status-histories} : get all the orderStatusHistories.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderStatusHistories in body.
     */
    @GetMapping("/order-status-histories")
    public ResponseEntity<List<OrderStatusHistoryDTO>> getAllOrderStatusHistories(Pageable pageable) {
        log.debug("REST request to get a page of OrderStatusHistories");
        Page<OrderStatusHistoryDTO> page = orderStatusHistoryService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /order-status-histories/:id} : get the "id" orderStatusHistory.
     *
     * @param id the id of the orderStatusHistoryDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderStatusHistoryDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/order-status-histories/{id}")
    public ResponseEntity<OrderStatusHistoryDTO> getOrderStatusHistory(@PathVariable Long id) {
        log.debug("REST request to get OrderStatusHistory : {}", id);
        Optional<OrderStatusHistoryDTO> orderStatusHistoryDTO = orderStatusHistoryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(orderStatusHistoryDTO);
    }

    /**
     * {@code DELETE  /order-status-histories/:id} : delete the "id" orderStatusHistory.
     *
     * @param id the id of the orderStatusHistoryDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/order-status-histories/{id}")
    public ResponseEntity<Void> deleteOrderStatusHistory(@PathVariable Long id) {
        log.debug("REST request to delete OrderStatusHistory : {}", id);
        orderStatusHistoryService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/order-status-histories?query=:query} : search for the orderStatusHistory corresponding
     * to the query.
     *
     * @param query the query of the orderStatusHistory search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/order-status-histories")
    public ResponseEntity<List<OrderStatusHistoryDTO>> searchOrderStatusHistories(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of OrderStatusHistories for query {}", query);
        Page<OrderStatusHistoryDTO> page = orderStatusHistoryService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
