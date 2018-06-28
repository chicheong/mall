package com.wongs.repository;

import com.wongs.domain.PaymentStatusHistory;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the PaymentStatusHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaymentStatusHistoryRepository extends JpaRepository<PaymentStatusHistory, Long> {

}
