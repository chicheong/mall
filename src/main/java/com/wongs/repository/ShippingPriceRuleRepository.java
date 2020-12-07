package com.wongs.repository;

import com.wongs.domain.ShippingPriceRule;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ShippingPriceRule entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShippingPriceRuleRepository extends JpaRepository<ShippingPriceRule, Long> {
}
