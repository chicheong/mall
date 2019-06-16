package com.wongs.web.rest;
import com.wongs.domain.MyState;
import com.wongs.repository.MyStateRepository;
import com.wongs.repository.search.MyStateSearchRepository;
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

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing MyState.
 */
@RestController
@RequestMapping("/api")
public class MyStateResource {

    private final Logger log = LoggerFactory.getLogger(MyStateResource.class);

    private static final String ENTITY_NAME = "myState";

    private final MyStateRepository myStateRepository;

    private final MyStateSearchRepository myStateSearchRepository;

    public MyStateResource(MyStateRepository myStateRepository, MyStateSearchRepository myStateSearchRepository) {
        this.myStateRepository = myStateRepository;
        this.myStateSearchRepository = myStateSearchRepository;
    }

    /**
     * POST  /my-states : Create a new myState.
     *
     * @param myState the myState to create
     * @return the ResponseEntity with status 201 (Created) and with body the new myState, or with status 400 (Bad Request) if the myState has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/my-states")
    public ResponseEntity<MyState> createMyState(@Valid @RequestBody MyState myState) throws URISyntaxException {
        log.debug("REST request to save MyState : {}", myState);
        if (myState.getId() != null) {
            throw new BadRequestAlertException("A new myState cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MyState result = myStateRepository.save(myState);
        myStateSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/my-states/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /my-states : Updates an existing myState.
     *
     * @param myState the myState to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated myState,
     * or with status 400 (Bad Request) if the myState is not valid,
     * or with status 500 (Internal Server Error) if the myState couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/my-states")
    public ResponseEntity<MyState> updateMyState(@Valid @RequestBody MyState myState) throws URISyntaxException {
        log.debug("REST request to update MyState : {}", myState);
        if (myState.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        MyState result = myStateRepository.save(myState);
        myStateSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, myState.getId().toString()))
            .body(result);
    }

    /**
     * GET  /my-states : get all the myStates.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of myStates in body
     */
    @GetMapping("/my-states")
    public ResponseEntity<List<MyState>> getAllMyStates(Pageable pageable) {
        log.debug("REST request to get a page of MyStates");
        Page<MyState> page = myStateRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/my-states");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /my-states/:id : get the "id" myState.
     *
     * @param id the id of the myState to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the myState, or with status 404 (Not Found)
     */
    @GetMapping("/my-states/{id}")
    public ResponseEntity<MyState> getMyState(@PathVariable Long id) {
        log.debug("REST request to get MyState : {}", id);
        Optional<MyState> myState = myStateRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(myState);
    }

    /**
     * DELETE  /my-states/:id : delete the "id" myState.
     *
     * @param id the id of the myState to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/my-states/{id}")
    public ResponseEntity<Void> deleteMyState(@PathVariable Long id) {
        log.debug("REST request to delete MyState : {}", id);
        myStateRepository.deleteById(id);
        myStateSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/my-states?query=:query : search for the myState corresponding
     * to the query.
     *
     * @param query the query of the myState search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/my-states")
    public ResponseEntity<List<MyState>> searchMyStates(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of MyStates for query {}", query);
        Page<MyState> page = myStateSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/my-states");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
