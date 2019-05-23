package com.wongs.web.rest;
import com.wongs.domain.Price;
import com.wongs.repository.PriceRepository;
import com.wongs.repository.search.PriceSearchRepository;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.web.rest.util.HeaderUtil;
import com.wongs.web.rest.util.PaginationUtil;
import com.wongs.service.dto.PriceDTO;
import com.wongs.service.mapper.PriceMapper;
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
 * REST controller for managing Price.
 */
@RestController
@RequestMapping("/api")
public class PriceResource {

    private final Logger log = LoggerFactory.getLogger(PriceResource.class);

    private static final String ENTITY_NAME = "price";

    private final PriceRepository priceRepository;

    private final PriceMapper priceMapper;

    private final PriceSearchRepository priceSearchRepository;

    public PriceResource(PriceRepository priceRepository, PriceMapper priceMapper, PriceSearchRepository priceSearchRepository) {
        this.priceRepository = priceRepository;
        this.priceMapper = priceMapper;
        this.priceSearchRepository = priceSearchRepository;
    }

    /**
     * POST  /prices : Create a new price.
     *
     * @param priceDTO the priceDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new priceDTO, or with status 400 (Bad Request) if the price has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/prices")
    public ResponseEntity<PriceDTO> createPrice(@RequestBody PriceDTO priceDTO) throws URISyntaxException {
        log.debug("REST request to save Price : {}", priceDTO);
        if (priceDTO.getId() != null) {
            throw new BadRequestAlertException("A new price cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Price price = priceMapper.toEntity(priceDTO);
        price = priceRepository.save(price);
        PriceDTO result = priceMapper.toDto(price);
        priceSearchRepository.save(price);
        return ResponseEntity.created(new URI("/api/prices/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /prices : Updates an existing price.
     *
     * @param priceDTO the priceDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated priceDTO,
     * or with status 400 (Bad Request) if the priceDTO is not valid,
     * or with status 500 (Internal Server Error) if the priceDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/prices")
    public ResponseEntity<PriceDTO> updatePrice(@RequestBody PriceDTO priceDTO) throws URISyntaxException {
        log.debug("REST request to update Price : {}", priceDTO);
        if (priceDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Price price = priceMapper.toEntity(priceDTO);
        price = priceRepository.save(price);
        PriceDTO result = priceMapper.toDto(price);
        priceSearchRepository.save(price);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, priceDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /prices : get all the prices.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of prices in body
     */
    @GetMapping("/prices")
    public ResponseEntity<List<PriceDTO>> getAllPrices(Pageable pageable) {
        log.debug("REST request to get a page of Prices");
        Page<PriceDTO> page = priceRepository.findAll(pageable).map(priceMapper::toDto);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/prices");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /prices/:id : get the "id" price.
     *
     * @param id the id of the priceDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the priceDTO, or with status 404 (Not Found)
     */
    @GetMapping("/prices/{id}")
    public ResponseEntity<PriceDTO> getPrice(@PathVariable Long id) {
        log.debug("REST request to get Price : {}", id);
        Optional<PriceDTO> priceDTO = priceRepository.findById(id)
            .map(priceMapper::toDto);
        return ResponseUtil.wrapOrNotFound(priceDTO);
    }

    /**
     * DELETE  /prices/:id : delete the "id" price.
     *
     * @param id the id of the priceDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/prices/{id}")
    public ResponseEntity<Void> deletePrice(@PathVariable Long id) {
        log.debug("REST request to delete Price : {}", id);
        priceRepository.deleteById(id);
        priceSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/prices?query=:query : search for the price corresponding
     * to the query.
     *
     * @param query the query of the price search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/prices")
    public ResponseEntity<List<PriceDTO>> searchPrices(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Prices for query {}", query);
        Page<Price> page = priceSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/prices");
        return ResponseEntity.ok().headers(headers).body(priceMapper.toDto(page.getContent()));
    }

}
