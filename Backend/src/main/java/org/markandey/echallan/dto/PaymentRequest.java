package org.markandey.echallan.dto;

import lombok.Data;

@Data
public class PaymentRequest {

    private Long challanId;

    private Double amount;
}
