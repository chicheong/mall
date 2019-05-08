package com.wongs.repository;

import com.wongs.domain.ShippingPriceRule;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the ShippingPriceRule entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShippingPriceRuleRepository extends JpaRepository<ShippingPriceRule, Long> {

}
