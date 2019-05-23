package com.wongs.repository;

import com.wongs.domain.Url;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Url entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {

}
