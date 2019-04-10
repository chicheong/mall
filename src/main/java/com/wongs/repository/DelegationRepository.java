package com.wongs.repository;

import com.wongs.domain.Delegation;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.Set;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;


/**
 * Spring Data JPA repository for the Delegation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DelegationRepository extends JpaRepository<Delegation, Long> {
	// not in use
	@Query(value = "SELECT d FROM Delegation d WHERE d.type = :type and ((d.from <= :today or d.from is null) and (d.to >= :today or d.to is null)) and d.delegateId IN :ids")
	Set<Delegation> findByTypeAndDelegationIdList(@Param("type") String type, @Param("today") ZonedDateTime today, @Param("ids") Collection<String> ids);
}
