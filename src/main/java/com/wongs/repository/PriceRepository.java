package com.wongs.repository;

import com.wongs.domain.Price;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Price entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PriceRepository extends JpaRepository<Price, Long> {

}
