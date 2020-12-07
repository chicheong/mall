package com.wongs.repository;

import com.wongs.domain.PaymentCard;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the PaymentCard entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaymentCardRepository extends JpaRepository<PaymentCard, Long> {
}
