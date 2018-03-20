package com.wongs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.wongs.domain.Url;
import com.wongs.service.UrlService;
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
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Url.
 */
@RestController
@RequestMapping("/api")
public class UrlResource {

    private final Logger log = LoggerFactory.getLogger(UrlResource.class);

    private static final String ENTITY_NAME = "url";

    private final UrlService urlService;

    public UrlResource(UrlService urlService) {
        this.urlService = urlService;
    }

    /**
     * POST  /urls : Create a new url.
     *
     * @param url the url to create
     * @return the ResponseEntity with status 201 (Created) and with body the new url, or with status 400 (Bad Request) if the url has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/urls")
    @Timed
    public ResponseEntity<Url> createUrl(@RequestBody Url url) throws URISyntaxException {
        log.debug("REST request to save Url : {}", url);
        if (url.getId() != null) {
            throw new BadRequestAlertException("A new url cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Url result = urlService.save(url);
        return ResponseEntity.created(new URI("/api/urls/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /urls : Updates an existing url.
     *
     * @param url the url to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated url,
     * or with status 400 (Bad Request) if the url is not valid,
     * or with status 500 (Internal Server Error) if the url couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/urls")
    @Timed
    public ResponseEntity<Url> updateUrl(@RequestBody Url url) throws URISyntaxException {
        log.debug("REST request to update Url : {}", url);
        if (url.getId() == null) {
            return createUrl(url);
        }
        Url result = urlService.save(url);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, url.getId().toString()))
            .body(result);
    }

    /**
     * GET  /urls : get all the urls.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of urls in body
     */
    @GetMapping("/urls")
    @Timed
    public ResponseEntity<List<Url>> getAllUrls(Pageable pageable) {
        log.debug("REST request to get a page of Urls");
        Page<Url> page = urlService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/urls");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /urls/:id : get the "id" url.
     *
     * @param id the id of the url to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the url, or with status 404 (Not Found)
     */
    @GetMapping("/urls/{id}")
    @Timed
    public ResponseEntity<Url> getUrl(@PathVariable Long id) {
        log.debug("REST request to get Url : {}", id);
        Url url = urlService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(url));
    }

    /**
     * DELETE  /urls/:id : delete the "id" url.
     *
     * @param id the id of the url to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/urls/{id}")
    @Timed
    public ResponseEntity<Void> deleteUrl(@PathVariable Long id) {
        log.debug("REST request to delete Url : {}", id);
        urlService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/urls?query=:query : search for the url corresponding
     * to the query.
     *
     * @param query the query of the url search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/urls")
    @Timed
    public ResponseEntity<List<Url>> searchUrls(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Urls for query {}", query);
        Page<Url> page = urlService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/urls");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
