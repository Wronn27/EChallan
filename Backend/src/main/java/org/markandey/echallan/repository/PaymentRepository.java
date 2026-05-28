package org.markandey.echallan.repository;

import org.markandey.echallan.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    @Query("SELECT SUM(p.amount) FROM Payment p")
    Double sumTotalRevenue();

}