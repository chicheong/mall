package com.wongs.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wongs.domain.Product;

/**
 * Spring Data  repository for the Product entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

	Set<Product> findByShopId(Long id);
	
    @Query("select product from Product product left join fetch product.items left join fetch product.styles where product.id =:id")
    Product findOneWithEagerRelationships(@Param("id") Long id);
}
