package com.wongs.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wongs.domain.Product;
import com.wongs.domain.ProductItem;


/**
 * Spring Data JPA repository for the ProductItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem,Long> {
    
	Set<ProductItem> findByProduct(Product product);
}
