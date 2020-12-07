package com.wongs.repository;

import com.wongs.domain.Url;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.Set;

/**
 * Spring Data  repository for the Url entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {
	Set<Url> findByEntityTypeAndEntityId(String entityType, Long entityId);
}
