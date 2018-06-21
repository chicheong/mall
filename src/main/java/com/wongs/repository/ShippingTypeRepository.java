package com.wongs.repository;

import com.wongs.domain.ShippingType;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the ShippingType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShippingTypeRepository extends JpaRepository<ShippingType, Long> {

}
