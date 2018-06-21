package com.wongs.repository;

import com.wongs.domain.CreditCard;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the CreditCard entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CreditCardRepository extends JpaRepository<CreditCard, Long> {

}
