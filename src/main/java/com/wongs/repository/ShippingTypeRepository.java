package com.wongs.repository;

import com.wongs.domain.ShippingType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ShippingType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShippingTypeRepository extends JpaRepository<ShippingType, Long> {

}
