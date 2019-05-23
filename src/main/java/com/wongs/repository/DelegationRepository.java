package com.wongs.repository;

import com.wongs.domain.Delegation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Delegation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DelegationRepository extends JpaRepository<Delegation, Long> {

}
