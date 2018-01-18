package com.wongs.repository;

import com.wongs.domain.Quantity;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Quantity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuantityRepository extends JpaRepository<Quantity, Long> {

}
