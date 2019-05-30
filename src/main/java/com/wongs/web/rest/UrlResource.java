package com.wongs.web.rest;
import com.wongs.service.UrlService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.web.rest.util.HeaderUtil;
import com.wongs.web.rest.util.PaginationUtil;
import com.wongs.service.dto.UrlDTO;
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
     * @param urlDTO the urlDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new urlDTO, or with status 400 (Bad Request) if the url has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/urls")
    public ResponseEntity<UrlDTO> createUrl(@RequestBody UrlDTO urlDTO) throws URISyntaxException {
        log.debug("REST request to save Url : {}", urlDTO);
        if (urlDTO.getId() != null) {
            throw new BadRequestAlertException("A new url cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UrlDTO result = urlService.save(urlDTO);
        return ResponseEntity.created(new URI("/api/urls/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /urls : Updates an existing url.
     *
     * @param urlDTO the urlDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated urlDTO,
     * or with status 400 (Bad Request) if the urlDTO is not valid,
     * or with status 500 (Internal Server Error) if the urlDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/urls")
    public ResponseEntity<UrlDTO> updateUrl(@RequestBody UrlDTO urlDTO) throws URISyntaxException {
        log.debug("REST request to update Url : {}", urlDTO);
        if (urlDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UrlDTO result = urlService.save(urlDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, urlDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /urls : get all the urls.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of urls in body
     */
    @GetMapping("/urls")
    public ResponseEntity<List<UrlDTO>> getAllUrls(Pageable pageable) {
        log.debug("REST request to get a page of Urls");
        Page<UrlDTO> page = urlService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/urls");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /urls/:id : get the "id" url.
     *
     * @param id the id of the urlDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the urlDTO, or with status 404 (Not Found)
     */
    @GetMapping("/urls/{id}")
    public ResponseEntity<UrlDTO> getUrl(@PathVariable Long id) {
        log.debug("REST request to get Url : {}", id);
        Optional<UrlDTO> urlDTO = urlService.findOne(id);
        return ResponseUtil.wrapOrNotFound(urlDTO);
    }

    /**
     * DELETE  /urls/:id : delete the "id" url.
     *
     * @param id the id of the urlDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/urls/{id}")
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
    public ResponseEntity<List<UrlDTO>> searchUrls(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Urls for query {}", query);
        Page<UrlDTO> page = urlService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/urls");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * POST  /urls/multiple : Create new urls.
     *
     * @param urlDTO the urlDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new urlDTO, or with status 400 (Bad Request) if the url has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/urls/multiple")
    public ResponseEntity<List<UrlDTO>> createUrls(@RequestBody List<UrlDTO> urlDTOs) throws URISyntaxException {
        for (UrlDTO urlDTO : urlDTOs) {
        	if (urlDTO.getId() != null) {
                throw new BadRequestAlertException("new urls cannot already have ID(s)", ENTITY_NAME, "idexists");
            }
        }
        for (UrlDTO urlDTO : urlDTOs) {
            UrlDTO result = urlService.save(urlDTO);
        }        
        return ResponseEntity.created(new URI("/api/urls/"))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, ""))
            .body(urlDTOs);
    }
}
