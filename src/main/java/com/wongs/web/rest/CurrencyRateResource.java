package com.wongs.web.rest;

import com.wongs.service.CurrencyRateService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.service.dto.CurrencyRateDTO;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.wongs.domain.CurrencyRate}.
 */
@RestController
@RequestMapping("/api")
public class CurrencyRateResource {

    private final Logger log = LoggerFactory.getLogger(CurrencyRateResource.class);

    private static final String ENTITY_NAME = "currencyRate";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CurrencyRateService currencyRateService;

    public CurrencyRateResource(CurrencyRateService currencyRateService) {
        this.currencyRateService = currencyRateService;
    }

    /**
     * {@code POST  /currency-rates} : Create a new currencyRate.
     *
     * @param currencyRateDTO the currencyRateDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new currencyRateDTO, or with status {@code 400 (Bad Request)} if the currencyRate has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/currency-rates")
    public ResponseEntity<CurrencyRateDTO> createCurrencyRate(@RequestBody CurrencyRateDTO currencyRateDTO) throws URISyntaxException {
        log.debug("REST request to save CurrencyRate : {}", currencyRateDTO);
        if (currencyRateDTO.getId() != null) {
            throw new BadRequestAlertException("A new currencyRate cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CurrencyRateDTO result = currencyRateService.save(currencyRateDTO);
        return ResponseEntity.created(new URI("/api/currency-rates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /currency-rates} : Updates an existing currencyRate.
     *
     * @param currencyRateDTO the currencyRateDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated currencyRateDTO,
     * or with status {@code 400 (Bad Request)} if the currencyRateDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the currencyRateDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/currency-rates")
    public ResponseEntity<CurrencyRateDTO> updateCurrencyRate(@RequestBody CurrencyRateDTO currencyRateDTO) throws URISyntaxException {
        log.debug("REST request to update CurrencyRate : {}", currencyRateDTO);
        if (currencyRateDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CurrencyRateDTO result = currencyRateService.save(currencyRateDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, currencyRateDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /currency-rates} : get all the currencyRates.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of currencyRates in body.
     */
    @GetMapping("/currency-rates")
    public List<CurrencyRateDTO> getAllCurrencyRates() {
        log.debug("REST request to get all CurrencyRates");
        return currencyRateService.findAll();
    }

    /**
     * {@code GET  /currency-rates/:id} : get the "id" currencyRate.
     *
     * @param id the id of the currencyRateDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the currencyRateDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/currency-rates/{id}")
    public ResponseEntity<CurrencyRateDTO> getCurrencyRate(@PathVariable Long id) {
        log.debug("REST request to get CurrencyRate : {}", id);
        Optional<CurrencyRateDTO> currencyRateDTO = currencyRateService.findOne(id);
        return ResponseUtil.wrapOrNotFound(currencyRateDTO);
    }

    /**
     * {@code DELETE  /currency-rates/:id} : delete the "id" currencyRate.
     *
     * @param id the id of the currencyRateDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/currency-rates/{id}")
    public ResponseEntity<Void> deleteCurrencyRate(@PathVariable Long id) {
        log.debug("REST request to delete CurrencyRate : {}", id);
        currencyRateService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/currency-rates?query=:query} : search for the currencyRate corresponding
     * to the query.
     *
     * @param query the query of the currencyRate search.
     * @return the result of the search.
     */
    @GetMapping("/_search/currency-rates")
    public List<CurrencyRateDTO> searchCurrencyRates(@RequestParam String query) {
        log.debug("REST request to search CurrencyRates for query {}", query);
        return currencyRateService.search(query);
    }
}
