package org.markandey.echallan.service;

import org.markandey.echallan.dto.PaymentRequest;
import org.markandey.echallan.entity.Challan;
import org.markandey.echallan.entity.Payment;
import org.markandey.echallan.repository.ChallanRepository;
import org.markandey.echallan.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final ChallanRepository challanRepo;

    public Payment payChallan(PaymentRequest request) {

        Challan challan =
                challanRepo.findById(request.getChallanId())
                        .orElseThrow();

        if (challan.getStatus().equals("PAID"))
            throw new RuntimeException("Already paid");

        challan.setStatus("PAID");

        challanRepo.save(challan);

        Payment payment = new Payment();

        payment.setChallanId(request.getChallanId());
        payment.setAmount(request.getAmount());
        payment.setStatus("SUCCESS");
        payment.setPaymentTime(LocalDateTime.now());

        return paymentRepo.save(payment);
    }
}
