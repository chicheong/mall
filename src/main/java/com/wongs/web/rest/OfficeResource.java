package com.wongs.web.rest;
import com.wongs.domain.Office;
import com.wongs.repository.OfficeRepository;
import com.wongs.repository.search.OfficeSearchRepository;
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
 * REST controller for managing Office.
 */
@RestController
@RequestMapping("/api")
public class OfficeResource {

    private final Logger log = LoggerFactory.getLogger(OfficeResource.class);

    private static final String ENTITY_NAME = "office";

    private final OfficeRepository officeRepository;

    private final OfficeSearchRepository officeSearchRepository;

    public OfficeResource(OfficeRepository officeRepository, OfficeSearchRepository officeSearchRepository) {
        this.officeRepository = officeRepository;
        this.officeSearchRepository = officeSearchRepository;
    }

    /**
     * POST  /offices : Create a new office.
     *
     * @param office the office to create
     * @return the ResponseEntity with status 201 (Created) and with body the new office, or with status 400 (Bad Request) if the office has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/offices")
    public ResponseEntity<Office> createOffice(@Valid @RequestBody Office office) throws URISyntaxException {
        log.debug("REST request to save Office : {}", office);
        if (office.getId() != null) {
            throw new BadRequestAlertException("A new office cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Office result = officeRepository.save(office);
        officeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/offices/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /offices : Updates an existing office.
     *
     * @param office the office to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated office,
     * or with status 400 (Bad Request) if the office is not valid,
     * or with status 500 (Internal Server Error) if the office couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/offices")
    public ResponseEntity<Office> updateOffice(@Valid @RequestBody Office office) throws URISyntaxException {
        log.debug("REST request to update Office : {}", office);
        if (office.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Office result = officeRepository.save(office);
        officeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, office.getId().toString()))
            .body(result);
    }

    /**
     * GET  /offices : get all the offices.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of offices in body
     */
    @GetMapping("/offices")
    public ResponseEntity<List<Office>> getAllOffices(Pageable pageable) {
        log.debug("REST request to get a page of Offices");
        Page<Office> page = officeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/offices");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /offices/:id : get the "id" office.
     *
     * @param id the id of the office to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the office, or with status 404 (Not Found)
     */
    @GetMapping("/offices/{id}")
    public ResponseEntity<Office> getOffice(@PathVariable Long id) {
        log.debug("REST request to get Office : {}", id);
        Optional<Office> office = officeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(office);
    }

    /**
     * DELETE  /offices/:id : delete the "id" office.
     *
     * @param id the id of the office to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/offices/{id}")
    public ResponseEntity<Void> deleteOffice(@PathVariable Long id) {
        log.debug("REST request to delete Office : {}", id);
        officeRepository.deleteById(id);
        officeSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/offices?query=:query : search for the office corresponding
     * to the query.
     *
     * @param query the query of the office search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/offices")
    public ResponseEntity<List<Office>> searchOffices(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Offices for query {}", query);
        Page<Office> page = officeSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/offices");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
