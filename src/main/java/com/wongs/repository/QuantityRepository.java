package com.wongs.repository;

import com.wongs.domain.Quantity;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Quantity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuantityRepository extends JpaRepository<Quantity, Long> {
}
