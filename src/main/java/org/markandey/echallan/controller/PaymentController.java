package org.markandey.echallan.controller;

import org.markandey.echallan.dto.PaymentRequest;
import org.markandey.echallan.entity.Payment;
import org.markandey.echallan.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService service;

    @PostMapping("/pay")
    public Payment pay(
            @RequestBody PaymentRequest request) {

        return service.payChallan(request);
    }
}
