package com.wongs.web.rest;
import com.wongs.service.UserInfoService;
import com.wongs.web.rest.errors.BadRequestAlertException;
import com.wongs.web.rest.util.HeaderUtil;
import com.wongs.web.rest.util.PaginationUtil;
import com.wongs.service.dto.UserInfoDTO;
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
 * REST controller for managing UserInfo.
 */
@RestController
@RequestMapping("/api")
public class UserInfoResource {

    private final Logger log = LoggerFactory.getLogger(UserInfoResource.class);

    private static final String ENTITY_NAME = "userInfo";

    private final UserInfoService userInfoService;

    public UserInfoResource(UserInfoService userInfoService) {
        this.userInfoService = userInfoService;
    }

    /**
     * POST  /user-infos : Create a new userInfo.
     *
     * @param userInfoDTO the userInfoDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new userInfoDTO, or with status 400 (Bad Request) if the userInfo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/user-infos")
    public ResponseEntity<UserInfoDTO> createUserInfo(@RequestBody UserInfoDTO userInfoDTO) throws URISyntaxException {
        log.debug("REST request to save UserInfo : {}", userInfoDTO);
        if (userInfoDTO.getId() != null) {
            throw new BadRequestAlertException("A new userInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserInfoDTO result = userInfoService.save(userInfoDTO);
        return ResponseEntity.created(new URI("/api/user-infos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /user-infos : Updates an existing userInfo.
     *
     * @param userInfoDTO the userInfoDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated userInfoDTO,
     * or with status 400 (Bad Request) if the userInfoDTO is not valid,
     * or with status 500 (Internal Server Error) if the userInfoDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/user-infos")
    public ResponseEntity<UserInfoDTO> updateUserInfo(@RequestBody UserInfoDTO userInfoDTO) throws URISyntaxException {
        log.debug("REST request to update UserInfo : {}", userInfoDTO);
        if (userInfoDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UserInfoDTO result = userInfoService.save(userInfoDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, userInfoDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /user-infos : get all the userInfos.
     *
     * @param pageable the pagination information
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many)
     * @return the ResponseEntity with status 200 (OK) and the list of userInfos in body
     */
    @GetMapping("/user-infos")
    public ResponseEntity<List<UserInfoDTO>> getAllUserInfos(Pageable pageable, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get a page of UserInfos");
        Page<UserInfoDTO> page;
        if (eagerload) {
            page = userInfoService.findAllWithEagerRelationships(pageable);
        } else {
            page = userInfoService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, String.format("/api/user-infos?eagerload=%b", eagerload));
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /user-infos/:id : get the "id" userInfo.
     *
     * @param id the id of the userInfoDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the userInfoDTO, or with status 404 (Not Found)
     */
    @GetMapping("/user-infos/{id}")
    public ResponseEntity<UserInfoDTO> getUserInfo(@PathVariable Long id) {
        log.debug("REST request to get UserInfo : {}", id);
        Optional<UserInfoDTO> userInfoDTO = userInfoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userInfoDTO);
    }

    /**
     * DELETE  /user-infos/:id : delete the "id" userInfo.
     *
     * @param id the id of the userInfoDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/user-infos/{id}")
    public ResponseEntity<Void> deleteUserInfo(@PathVariable Long id) {
        log.debug("REST request to delete UserInfo : {}", id);
        userInfoService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/user-infos?query=:query : search for the userInfo corresponding
     * to the query.
     *
     * @param query the query of the userInfo search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/user-infos")
    public ResponseEntity<List<UserInfoDTO>> searchUserInfos(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of UserInfos for query {}", query);
        Page<UserInfoDTO> page = userInfoService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/user-infos");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
