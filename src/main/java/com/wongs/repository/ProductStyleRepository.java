package com.wongs.repository;

import com.wongs.domain.ProductStyle;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ProductStyle entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductStyleRepository extends JpaRepository<ProductStyle, Long> {

}
