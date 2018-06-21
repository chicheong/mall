package com.wongs.repository;

import com.wongs.domain.PaymentCreditCard;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the PaymentCreditCard entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaymentCreditCardRepository extends JpaRepository<PaymentCreditCard, Long> {

}
