package com.wongs.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wongs.domain.Url;


/**
 * Spring Data JPA repository for the Url entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {
    Set<Url> findByEntityTypeAndEntityId(String entityType, Long entityId);
}
