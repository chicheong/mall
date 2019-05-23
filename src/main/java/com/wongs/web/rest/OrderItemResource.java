package com.wongs.web.rest;
import com.wongs.domain.OrderItem;
import com.wongs.repository.OrderItemRepository;
import com.wongs.repository.search.OrderItemSearchRepository;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.web.rest.util.HeaderUtil;
import com.wongs.web.rest.util.PaginationUtil;
import com.wongs.service.dto.OrderItemDTO;
import com.wongs.service.mapper.OrderItemMapper;
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
 * REST controller for managing OrderItem.
 */
@RestController
@RequestMapping("/api")
public class OrderItemResource {

    private final Logger log = LoggerFactory.getLogger(OrderItemResource.class);

    private static final String ENTITY_NAME = "orderItem";

    private final OrderItemRepository orderItemRepository;

    private final OrderItemMapper orderItemMapper;

    private final OrderItemSearchRepository orderItemSearchRepository;

    public OrderItemResource(OrderItemRepository orderItemRepository, OrderItemMapper orderItemMapper, OrderItemSearchRepository orderItemSearchRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderItemMapper = orderItemMapper;
        this.orderItemSearchRepository = orderItemSearchRepository;
    }

    /**
     * POST  /order-items : Create a new orderItem.
     *
     * @param orderItemDTO the orderItemDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new orderItemDTO, or with status 400 (Bad Request) if the orderItem has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/order-items")
    public ResponseEntity<OrderItemDTO> createOrderItem(@RequestBody OrderItemDTO orderItemDTO) throws URISyntaxException {
        log.debug("REST request to save OrderItem : {}", orderItemDTO);
        if (orderItemDTO.getId() != null) {
            throw new BadRequestAlertException("A new orderItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrderItem orderItem = orderItemMapper.toEntity(orderItemDTO);
        orderItem = orderItemRepository.save(orderItem);
        OrderItemDTO result = orderItemMapper.toDto(orderItem);
        orderItemSearchRepository.save(orderItem);
        return ResponseEntity.created(new URI("/api/order-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /order-items : Updates an existing orderItem.
     *
     * @param orderItemDTO the orderItemDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated orderItemDTO,
     * or with status 400 (Bad Request) if the orderItemDTO is not valid,
     * or with status 500 (Internal Server Error) if the orderItemDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/order-items")
    public ResponseEntity<OrderItemDTO> updateOrderItem(@RequestBody OrderItemDTO orderItemDTO) throws URISyntaxException {
        log.debug("REST request to update OrderItem : {}", orderItemDTO);
        if (orderItemDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        OrderItem orderItem = orderItemMapper.toEntity(orderItemDTO);
        orderItem = orderItemRepository.save(orderItem);
        OrderItemDTO result = orderItemMapper.toDto(orderItem);
        orderItemSearchRepository.save(orderItem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, orderItemDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /order-items : get all the orderItems.
     *
     * @param pageable the pagination information
     * @param filter the filter of the request
     * @return the ResponseEntity with status 200 (OK) and the list of orderItems in body
     */
    @GetMapping("/order-items")
    public ResponseEntity<List<OrderItemDTO>> getAllOrderItems(Pageable pageable, @RequestParam(required = false) String filter) {
        if ("productitem-is-null".equals(filter)) {
            log.debug("REST request to get all OrderItems where productItem is null");
            return new ResponseEntity<>(StreamSupport
                .stream(orderItemRepository.findAll().spliterator(), false)
                .filter(orderItem -> orderItem.getProductItem() == null)
                .map(orderItemMapper::toDto)
                .collect(Collectors.toList()), HttpStatus.OK);
        }
        log.debug("REST request to get a page of OrderItems");
        Page<OrderItemDTO> page = orderItemRepository.findAll(pageable).map(orderItemMapper::toDto);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/order-items");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /order-items/:id : get the "id" orderItem.
     *
     * @param id the id of the orderItemDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the orderItemDTO, or with status 404 (Not Found)
     */
    @GetMapping("/order-items/{id}")
    public ResponseEntity<OrderItemDTO> getOrderItem(@PathVariable Long id) {
        log.debug("REST request to get OrderItem : {}", id);
        Optional<OrderItemDTO> orderItemDTO = orderItemRepository.findById(id)
            .map(orderItemMapper::toDto);
        return ResponseUtil.wrapOrNotFound(orderItemDTO);
    }

    /**
     * DELETE  /order-items/:id : delete the "id" orderItem.
     *
     * @param id the id of the orderItemDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/order-items/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Long id) {
        log.debug("REST request to delete OrderItem : {}", id);
        orderItemRepository.deleteById(id);
        orderItemSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/order-items?query=:query : search for the orderItem corresponding
     * to the query.
     *
     * @param query the query of the orderItem search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/order-items")
    public ResponseEntity<List<OrderItemDTO>> searchOrderItems(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of OrderItems for query {}", query);
        Page<OrderItem> page = orderItemSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/order-items");
        return ResponseEntity.ok().headers(headers).body(orderItemMapper.toDto(page.getContent()));
    }

}
