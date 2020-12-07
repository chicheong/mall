package com.wongs.repository;

import com.wongs.domain.Shop;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import org.springframework.data.repository.query.Param;

/**
 * Spring Data  repository for the Shop entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {

	Shop findByCode(String code);
	
//    @Query("select shop from Shop shop where shop.id =:id")
//    Shop findOneWithEagerRelationships(@Param("id") Long id);
//	  left join fetch shop.accounts a left join fetch a.userInfos i left join fetch i.user
}
