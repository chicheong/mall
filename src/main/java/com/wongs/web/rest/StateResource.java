package com.wongs.web.rest;
import com.wongs.domain.State;
import com.wongs.repository.StateRepository;
import com.wongs.repository.search.StateSearchRepository;
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
 * REST controller for managing State.
 */
@RestController
@RequestMapping("/api")
public class StateResource {

    private final Logger log = LoggerFactory.getLogger(StateResource.class);

    private static final String ENTITY_NAME = "state";

    private final StateRepository stateRepository;

    private final StateSearchRepository stateSearchRepository;

    public StateResource(StateRepository stateRepository, StateSearchRepository stateSearchRepository) {
        this.stateRepository = stateRepository;
        this.stateSearchRepository = stateSearchRepository;
    }

    /**
     * POST  /states : Create a new state.
     *
     * @param state the state to create
     * @return the ResponseEntity with status 201 (Created) and with body the new state, or with status 400 (Bad Request) if the state has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/states")
    public ResponseEntity<State> createState(@Valid @RequestBody State state) throws URISyntaxException {
        log.debug("REST request to save State : {}", state);
        if (state.getId() != null) {
            throw new BadRequestAlertException("A new state cannot already have an ID", ENTITY_NAME, "idexists");
        }
        State result = stateRepository.save(state);
        stateSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/states/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /states : Updates an existing state.
     *
     * @param state the state to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated state,
     * or with status 400 (Bad Request) if the state is not valid,
     * or with status 500 (Internal Server Error) if the state couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/states")
    public ResponseEntity<State> updateState(@Valid @RequestBody State state) throws URISyntaxException {
        log.debug("REST request to update State : {}", state);
        if (state.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        State result = stateRepository.save(state);
        stateSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, state.getId().toString()))
            .body(result);
    }

    /**
     * GET  /states : get all the states.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of states in body
     */
    @GetMapping("/states")
    public ResponseEntity<List<State>> getAllStates(Pageable pageable) {
        log.debug("REST request to get a page of States");
        Page<State> page = stateRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/states");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /states/:id : get the "id" state.
     *
     * @param id the id of the state to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the state, or with status 404 (Not Found)
     */
    @GetMapping("/states/{id}")
    public ResponseEntity<State> getState(@PathVariable Long id) {
        log.debug("REST request to get State : {}", id);
        Optional<State> state = stateRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(state);
    }

    /**
     * DELETE  /states/:id : delete the "id" state.
     *
     * @param id the id of the state to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/states/{id}")
    public ResponseEntity<Void> deleteState(@PathVariable Long id) {
        log.debug("REST request to delete State : {}", id);
        stateRepository.deleteById(id);
        stateSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/states?query=:query : search for the state corresponding
     * to the query.
     *
     * @param query the query of the state search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/states")
    public ResponseEntity<List<State>> searchStates(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of States for query {}", query);
        Page<State> page = stateSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/states");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
