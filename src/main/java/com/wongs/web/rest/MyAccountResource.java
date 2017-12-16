package com.wongs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.wongs.domain.MyAccount;

import com.wongs.repository.MyAccountRepository;
import com.wongs.repository.search.MyAccountSearchRepository;
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
 * REST controller for managing MyAccount.
 */
@RestController
@RequestMapping("/api")
public class MyAccountResource {

    private final Logger log = LoggerFactory.getLogger(MyAccountResource.class);

    private static final String ENTITY_NAME = "myAccount";

    private final MyAccountRepository myAccountRepository;

    private final MyAccountSearchRepository myAccountSearchRepository;

    public MyAccountResource(MyAccountRepository myAccountRepository, MyAccountSearchRepository myAccountSearchRepository) {
        this.myAccountRepository = myAccountRepository;
        this.myAccountSearchRepository = myAccountSearchRepository;
    }

    /**
     * POST  /my-accounts : Create a new myAccount.
     *
     * @param myAccount the myAccount to create
     * @return the ResponseEntity with status 201 (Created) and with body the new myAccount, or with status 400 (Bad Request) if the myAccount has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/my-accounts")
    @Timed
    public ResponseEntity<MyAccount> createMyAccount(@RequestBody MyAccount myAccount) throws URISyntaxException {
        log.debug("REST request to save MyAccount : {}", myAccount);
        if (myAccount.getId() != null) {
            throw new BadRequestAlertException("A new myAccount cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MyAccount result = myAccountRepository.save(myAccount);
        myAccountSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/my-accounts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /my-accounts : Updates an existing myAccount.
     *
     * @param myAccount the myAccount to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated myAccount,
     * or with status 400 (Bad Request) if the myAccount is not valid,
     * or with status 500 (Internal Server Error) if the myAccount couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/my-accounts")
    @Timed
    public ResponseEntity<MyAccount> updateMyAccount(@RequestBody MyAccount myAccount) throws URISyntaxException {
        log.debug("REST request to update MyAccount : {}", myAccount);
        if (myAccount.getId() == null) {
            return createMyAccount(myAccount);
        }
        MyAccount result = myAccountRepository.save(myAccount);
        myAccountSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, myAccount.getId().toString()))
            .body(result);
    }

    /**
     * GET  /my-accounts : get all the myAccounts.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of myAccounts in body
     */
    @GetMapping("/my-accounts")
    @Timed
    public ResponseEntity<List<MyAccount>> getAllMyAccounts(Pageable pageable) {
        log.debug("REST request to get a page of MyAccounts");
        Page<MyAccount> page = myAccountRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/my-accounts");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /my-accounts/:id : get the "id" myAccount.
     *
     * @param id the id of the myAccount to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the myAccount, or with status 404 (Not Found)
     */
    @GetMapping("/my-accounts/{id}")
    @Timed
    public ResponseEntity<MyAccount> getMyAccount(@PathVariable Long id) {
        log.debug("REST request to get MyAccount : {}", id);
        MyAccount myAccount = myAccountRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(myAccount));
    }

    /**
     * DELETE  /my-accounts/:id : delete the "id" myAccount.
     *
     * @param id the id of the myAccount to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/my-accounts/{id}")
    @Timed
    public ResponseEntity<Void> deleteMyAccount(@PathVariable Long id) {
        log.debug("REST request to delete MyAccount : {}", id);
        myAccountRepository.delete(id);
        myAccountSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/my-accounts?query=:query : search for the myAccount corresponding
     * to the query.
     *
     * @param query the query of the myAccount search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/my-accounts")
    @Timed
    public ResponseEntity<List<MyAccount>> searchMyAccounts(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of MyAccounts for query {}", query);
        Page<MyAccount> page = myAccountSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/my-accounts");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
