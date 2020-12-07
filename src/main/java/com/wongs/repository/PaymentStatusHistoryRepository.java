package com.wongs.repository;

import com.wongs.domain.PaymentStatusHistory;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the PaymentStatusHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaymentStatusHistoryRepository extends JpaRepository<PaymentStatusHistory, Long> {
}
