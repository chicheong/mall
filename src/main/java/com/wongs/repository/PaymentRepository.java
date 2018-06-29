package com.wongs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wongs.domain.MyOrder;
import com.wongs.domain.Payment;


/**
 * Spring Data JPA repository for the Payment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

	Payment findByOrder(MyOrder myOrder);
}
