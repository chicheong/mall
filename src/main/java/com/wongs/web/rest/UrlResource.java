package com.wongs.web.rest;

import com.wongs.service.UrlService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.UrlDTO;

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
 * REST controller for managing {@link com.wongs.domain.Url}.
 */
@RestController
@RequestMapping("/api")
public class UrlResource {

    private final Logger log = LoggerFactory.getLogger(UrlResource.class);

    private static final String ENTITY_NAME = "url";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UrlService urlService;

    public UrlResource(UrlService urlService) {
        this.urlService = urlService;
    }

    /**
     * {@code POST  /urls} : Create a new url.
     *
     * @param urlDTO the urlDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new urlDTO, or with status {@code 400 (Bad Request)} if the url has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/urls")
    public ResponseEntity<UrlDTO> createUrl(@RequestBody UrlDTO urlDTO) throws URISyntaxException {
        log.debug("REST request to save Url : {}", urlDTO);
        if (urlDTO.getId() != null) {
            throw new BadRequestAlertException("A new url cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UrlDTO result = urlService.save(urlDTO);
        return ResponseEntity.created(new URI("/api/urls/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /urls} : Updates an existing url.
     *
     * @param urlDTO the urlDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated urlDTO,
     * or with status {@code 400 (Bad Request)} if the urlDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the urlDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/urls")
    public ResponseEntity<UrlDTO> updateUrl(@RequestBody UrlDTO urlDTO) throws URISyntaxException {
        log.debug("REST request to update Url : {}", urlDTO);
        if (urlDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UrlDTO result = urlService.save(urlDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, urlDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /urls} : get all the urls.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of urls in body.
     */
    @GetMapping("/urls")
    public ResponseEntity<List<UrlDTO>> getAllUrls(Pageable pageable) {
        log.debug("REST request to get a page of Urls");
        Page<UrlDTO> page = urlService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /urls/:id} : get the "id" url.
     *
     * @param id the id of the urlDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the urlDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/urls/{id}")
    public ResponseEntity<UrlDTO> getUrl(@PathVariable Long id) {
        log.debug("REST request to get Url : {}", id);
        Optional<UrlDTO> urlDTO = urlService.findOne(id);
        return ResponseUtil.wrapOrNotFound(urlDTO);
    }

    /**
     * {@code DELETE  /urls/:id} : delete the "id" url.
     *
     * @param id the id of the urlDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/urls/{id}")
    public ResponseEntity<Void> deleteUrl(@PathVariable Long id) {
        log.debug("REST request to delete Url : {}", id);
        urlService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/urls?query=:query} : search for the url corresponding
     * to the query.
     *
     * @param query the query of the url search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/urls")
    public ResponseEntity<List<UrlDTO>> searchUrls(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Urls for query {}", query);
        Page<UrlDTO> page = urlService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
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
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, ""))
            .body(urlDTOs);
    }
}
