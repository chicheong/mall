package com.wongs.web.rest;
import com.wongs.domain.CurrencyRate;
import com.wongs.repository.CurrencyRateRepository;
import com.wongs.repository.search.CurrencyRateSearchRepository;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
 * REST controller for managing CurrencyRate.
 */
@RestController
@RequestMapping("/api")
public class CurrencyRateResource {

    private final Logger log = LoggerFactory.getLogger(CurrencyRateResource.class);

    private static final String ENTITY_NAME = "currencyRate";

    private final CurrencyRateRepository currencyRateRepository;

    private final CurrencyRateSearchRepository currencyRateSearchRepository;

    public CurrencyRateResource(CurrencyRateRepository currencyRateRepository, CurrencyRateSearchRepository currencyRateSearchRepository) {
        this.currencyRateRepository = currencyRateRepository;
        this.currencyRateSearchRepository = currencyRateSearchRepository;
    }

    /**
     * POST  /currency-rates : Create a new currencyRate.
     *
     * @param currencyRate the currencyRate to create
     * @return the ResponseEntity with status 201 (Created) and with body the new currencyRate, or with status 400 (Bad Request) if the currencyRate has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/currency-rates")
    public ResponseEntity<CurrencyRate> createCurrencyRate(@RequestBody CurrencyRate currencyRate) throws URISyntaxException {
        log.debug("REST request to save CurrencyRate : {}", currencyRate);
        if (currencyRate.getId() != null) {
            throw new BadRequestAlertException("A new currencyRate cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CurrencyRate result = currencyRateRepository.save(currencyRate);
        currencyRateSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/currency-rates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /currency-rates : Updates an existing currencyRate.
     *
     * @param currencyRate the currencyRate to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated currencyRate,
     * or with status 400 (Bad Request) if the currencyRate is not valid,
     * or with status 500 (Internal Server Error) if the currencyRate couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/currency-rates")
    public ResponseEntity<CurrencyRate> updateCurrencyRate(@RequestBody CurrencyRate currencyRate) throws URISyntaxException {
        log.debug("REST request to update CurrencyRate : {}", currencyRate);
        if (currencyRate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CurrencyRate result = currencyRateRepository.save(currencyRate);
        currencyRateSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, currencyRate.getId().toString()))
            .body(result);
    }

    /**
     * GET  /currency-rates : get all the currencyRates.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of currencyRates in body
     */
    @GetMapping("/currency-rates")
    public List<CurrencyRate> getAllCurrencyRates() {
        log.debug("REST request to get all CurrencyRates");
        return currencyRateRepository.findAll();
    }

    /**
     * GET  /currency-rates/:id : get the "id" currencyRate.
     *
     * @param id the id of the currencyRate to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the currencyRate, or with status 404 (Not Found)
     */
    @GetMapping("/currency-rates/{id}")
    public ResponseEntity<CurrencyRate> getCurrencyRate(@PathVariable Long id) {
        log.debug("REST request to get CurrencyRate : {}", id);
        Optional<CurrencyRate> currencyRate = currencyRateRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(currencyRate);
    }

    /**
     * DELETE  /currency-rates/:id : delete the "id" currencyRate.
     *
     * @param id the id of the currencyRate to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/currency-rates/{id}")
    public ResponseEntity<Void> deleteCurrencyRate(@PathVariable Long id) {
        log.debug("REST request to delete CurrencyRate : {}", id);
        currencyRateRepository.deleteById(id);
        currencyRateSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/currency-rates?query=:query : search for the currencyRate corresponding
     * to the query.
     *
     * @param query the query of the currencyRate search
     * @return the result of the search
     */
    @GetMapping("/_search/currency-rates")
    public List<CurrencyRate> searchCurrencyRates(@RequestParam String query) {
        log.debug("REST request to search CurrencyRates for query {}", query);
        return StreamSupport
            .stream(currencyRateSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
