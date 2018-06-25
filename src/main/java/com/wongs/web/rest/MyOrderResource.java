package com.wongs.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

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

import com.codahale.metrics.annotation.Timed;
import com.wongs.domain.OrderItem;
import com.wongs.security.SecurityUtils;
import com.wongs.service.MyAccountService;
import com.wongs.service.MyOrderService;
import com.wongs.service.ShippingService;
import com.wongs.service.UserInfoService;
import com.wongs.service.UserService;
import com.wongs.service.dto.MyAccountDTO;
import com.wongs.service.dto.MyOrderDTO;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.web.rest.util.HeaderUtil;
import com.wongs.web.rest.util.PaginationUtil;

import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing MyOrder.
 */
@RestController
@RequestMapping("/api")
public class MyOrderResource {

    private final Logger log = LoggerFactory.getLogger(MyOrderResource.class);

    private static final String ENTITY_NAME = "myOrder";

    private final MyOrderService myOrderService;
    private final UserInfoService userInfoService;
    private final MyAccountService myAccountService;
    private final ShippingService shippingService;
    
    private final UserService userService;

    public MyOrderResource(MyOrderService myOrderService, UserInfoService userInfoService, MyAccountService myAccountService, 
    						UserService userService, ShippingService shippingService) {
    	this.myOrderService = myOrderService;
    	this.userInfoService = userInfoService;
    	this.myAccountService = myAccountService;
        this.userService = userService;
        this.shippingService = shippingService;
    }

    /**
     * POST  /my-orders : Create a new myOrder.
     *
     * @param myOrderDTO the myOrderDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new myOrderDTO, or with status 400 (Bad Request) if the myOrder has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/my-orders")
    @Timed
    public ResponseEntity<MyOrderDTO> createMyOrder(@RequestBody MyOrderDTO myOrderDTO) throws URISyntaxException {
        log.debug("REST request to save MyOrder : {}", myOrderDTO);
        if (myOrderDTO.getId() != null) {
            throw new BadRequestAlertException("A new myOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MyOrderDTO result = myOrderService.save(myOrderDTO);
        return ResponseEntity.created(new URI("/api/my-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /my-orders : Updates an existing myOrder.
     *
     * @param myOrderDTO the myOrderDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated myOrderDTO,
     * or with status 400 (Bad Request) if the myOrderDTO is not valid,
     * or with status 500 (Internal Server Error) if the myOrderDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/my-orders")
    @Timed
    public ResponseEntity<MyOrderDTO> updateMyOrder(@RequestBody MyOrderDTO myOrderDTO) throws URISyntaxException {
        log.debug("REST request to update MyOrder : {}", myOrderDTO);
        if (myOrderDTO.getId() == null) {
            return createMyOrder(myOrderDTO);
        }
        MyOrderDTO result = myOrderService.save(myOrderDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, myOrderDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /my-orders : get all the myOrders.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of myOrders in body
     */
    @GetMapping("/my-orders")
    @Timed
    public ResponseEntity<List<MyOrderDTO>> getAllMyOrders(Pageable pageable) {
        log.debug("REST request to get a page of MyOrders");
        Page<MyOrderDTO> page = myOrderService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/my-orders");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /my-orders/:id : get the "id" myOrder.
     *
     * @param id the id of the myOrderDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the myOrderDTO, or with status 404 (Not Found)
     */
    @GetMapping("/my-orders/{id}")
    @Timed
    public ResponseEntity<MyOrderDTO> getMyOrder(@PathVariable Long id) {
        log.debug("REST request to get MyOrder : {}", id);
        MyOrderDTO myOrderDTO = myOrderService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(myOrderDTO));
    }

    /**
     * DELETE  /my-orders/:id : delete the "id" myOrder.
     *
     * @param id the id of the myOrderDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/my-orders/{id}")
    @Timed
    public ResponseEntity<Void> deleteMyOrder(@PathVariable Long id) {
        log.debug("REST request to delete MyOrder : {}", id);
        myOrderService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/my-orders?query=:query : search for the myOrder corresponding
     * to the query.
     *
     * @param query the query of the myOrder search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/my-orders")
    @Timed
    public ResponseEntity<List<MyOrderDTO>> searchMyOrders(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of MyOrders for query {}", query);
        Page<MyOrderDTO> page = myOrderService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/my-orders");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * POST  /my-cart : Creates or Updates an existing cart.
     *
     * @param productItem the ProductItem to add to cart
     * @return the ResponseEntity with status 200 (OK) and with body the updated myOrderDTO,
     * or with status 400 (Bad Request) if the myOrderDTO is not valid,
     * or with status 500 (Internal Server Error) if the myOrderDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/my-cart")
    @Timed
    public ResponseEntity<MyOrderDTO> addToCart(@RequestBody OrderItem orderItem) throws URISyntaxException {
        log.debug("REST request to update OrderItem : {}", orderItem);
        
        MyAccountDTO myAccount = myAccountService.findOne(userInfoService.findOneWithAccountsByUserLogin(SecurityUtils.getCurrentUserLogin().get()).getAccountId());
        MyOrderDTO myOrderDTO  = myOrderService.addToCart(myAccount, orderItem);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, myOrderDTO.getId().toString()))
            .body(myOrderDTO);
    }
}
