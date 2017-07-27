package com.wongs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.wongs.domain.UserInfo;

import com.wongs.repository.UserInfoRepository;
import com.wongs.repository.search.UserInfoSearchRepository;
import com.wongs.web.rest.util.HeaderUtil;
import com.wongs.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
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
 * REST controller for managing UserInfo.
 */
@RestController
@RequestMapping("/api")
public class UserInfoResource {

    private final Logger log = LoggerFactory.getLogger(UserInfoResource.class);

    private static final String ENTITY_NAME = "userInfo";

    private final UserInfoRepository userInfoRepository;

    private final UserInfoSearchRepository userInfoSearchRepository;

    public UserInfoResource(UserInfoRepository userInfoRepository, UserInfoSearchRepository userInfoSearchRepository) {
        this.userInfoRepository = userInfoRepository;
        this.userInfoSearchRepository = userInfoSearchRepository;
    }

    /**
     * POST  /user-infos : Create a new userInfo.
     *
     * @param userInfo the userInfo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new userInfo, or with status 400 (Bad Request) if the userInfo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/user-infos")
    @Timed
    public ResponseEntity<UserInfo> createUserInfo(@RequestBody UserInfo userInfo) throws URISyntaxException {
        log.debug("REST request to save UserInfo : {}", userInfo);
        if (userInfo.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new userInfo cannot already have an ID")).body(null);
        }
        UserInfo result = userInfoRepository.save(userInfo);
        userInfoSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/user-infos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /user-infos : Updates an existing userInfo.
     *
     * @param userInfo the userInfo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated userInfo,
     * or with status 400 (Bad Request) if the userInfo is not valid,
     * or with status 500 (Internal Server Error) if the userInfo couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/user-infos")
    @Timed
    public ResponseEntity<UserInfo> updateUserInfo(@RequestBody UserInfo userInfo) throws URISyntaxException {
        log.debug("REST request to update UserInfo : {}", userInfo);
        if (userInfo.getId() == null) {
            return createUserInfo(userInfo);
        }
        UserInfo result = userInfoRepository.save(userInfo);
        userInfoSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, userInfo.getId().toString()))
            .body(result);
    }

    /**
     * GET  /user-infos : get all the userInfos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of userInfos in body
     */
    @GetMapping("/user-infos")
    @Timed
    public ResponseEntity<List<UserInfo>> getAllUserInfos(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of UserInfos");
        Page<UserInfo> page = userInfoRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/user-infos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /user-infos/:id : get the "id" userInfo.
     *
     * @param id the id of the userInfo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the userInfo, or with status 404 (Not Found)
     */
    @GetMapping("/user-infos/{id}")
    @Timed
    public ResponseEntity<UserInfo> getUserInfo(@PathVariable Long id) {
        log.debug("REST request to get UserInfo : {}", id);
        UserInfo userInfo = userInfoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(userInfo));
    }

    /**
     * DELETE  /user-infos/:id : delete the "id" userInfo.
     *
     * @param id the id of the userInfo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/user-infos/{id}")
    @Timed
    public ResponseEntity<Void> deleteUserInfo(@PathVariable Long id) {
        log.debug("REST request to delete UserInfo : {}", id);
        userInfoRepository.delete(id);
        userInfoSearchRepository.delete(id);
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
    @Timed
    public ResponseEntity<List<UserInfo>> searchUserInfos(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of UserInfos for query {}", query);
        Page<UserInfo> page = userInfoSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/user-infos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
