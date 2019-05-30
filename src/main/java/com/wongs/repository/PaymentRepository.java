package com.wongs.repository;

import com.wongs.domain.Payment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import com.wongs.domain.MyOrder;

/**
 * Spring Data  repository for the Payment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

	Payment findByOrder(MyOrder myOrder);
}
