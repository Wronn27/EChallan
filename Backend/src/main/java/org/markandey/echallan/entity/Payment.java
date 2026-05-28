package org.markandey.echallan.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long challanId;

    private Double amount;

    private String status;

    private LocalDateTime paymentTime;
}