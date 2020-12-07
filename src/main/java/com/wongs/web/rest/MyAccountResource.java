package com.wongs.web.rest;

import com.wongs.service.MyAccountService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.MyAccountDTO;

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
 * REST controller for managing {@link com.wongs.domain.MyAccount}.
 */
@RestController
@RequestMapping("/api")
public class MyAccountResource {

    private final Logger log = LoggerFactory.getLogger(MyAccountResource.class);

    private static final String ENTITY_NAME = "myAccount";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MyAccountService myAccountService;

    public MyAccountResource(MyAccountService myAccountService) {
        this.myAccountService = myAccountService;
    }

    /**
     * {@code POST  /my-accounts} : Create a new myAccount.
     *
     * @param myAccountDTO the myAccountDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new myAccountDTO, or with status {@code 400 (Bad Request)} if the myAccount has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/my-accounts")
    public ResponseEntity<MyAccountDTO> createMyAccount(@RequestBody MyAccountDTO myAccountDTO) throws URISyntaxException {
        log.debug("REST request to save MyAccount : {}", myAccountDTO);
        if (myAccountDTO.getId() != null) {
            throw new BadRequestAlertException("A new myAccount cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MyAccountDTO result = myAccountService.save(myAccountDTO);
        return ResponseEntity.created(new URI("/api/my-accounts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /my-accounts} : Updates an existing myAccount.
     *
     * @param myAccountDTO the myAccountDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated myAccountDTO,
     * or with status {@code 400 (Bad Request)} if the myAccountDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the myAccountDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/my-accounts")
    public ResponseEntity<MyAccountDTO> updateMyAccount(@RequestBody MyAccountDTO myAccountDTO) throws URISyntaxException {
        log.debug("REST request to update MyAccount : {}", myAccountDTO);
        if (myAccountDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        MyAccountDTO result = myAccountService.save(myAccountDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, myAccountDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /my-accounts} : get all the myAccounts.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of myAccounts in body.
     */
    @GetMapping("/my-accounts")
    public ResponseEntity<List<MyAccountDTO>> getAllMyAccounts(Pageable pageable, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get a page of MyAccounts");
        Page<MyAccountDTO> page;
        if (eagerload) {
            page = myAccountService.findAllWithEagerRelationships(pageable);
        } else {
            page = myAccountService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /my-accounts/:id} : get the "id" myAccount.
     *
     * @param id the id of the myAccountDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the myAccountDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/my-accounts/{id}")
    public ResponseEntity<MyAccountDTO> getMyAccount(@PathVariable Long id) {
        log.debug("REST request to get MyAccount : {}", id);
        Optional<MyAccountDTO> myAccountDTO = myAccountService.findOne(id);
        return ResponseUtil.wrapOrNotFound(myAccountDTO);
    }

    /**
     * {@code DELETE  /my-accounts/:id} : delete the "id" myAccount.
     *
     * @param id the id of the myAccountDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/my-accounts/{id}")
    public ResponseEntity<Void> deleteMyAccount(@PathVariable Long id) {
        log.debug("REST request to delete MyAccount : {}", id);
        myAccountService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/my-accounts?query=:query} : search for the myAccount corresponding
     * to the query.
     *
     * @param query the query of the myAccount search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/my-accounts")
    public ResponseEntity<List<MyAccountDTO>> searchMyAccounts(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of MyAccounts for query {}", query);
        Page<MyAccountDTO> page = myAccountService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
