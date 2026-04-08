package org.markandey.echallan.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Challan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleNumber;

    private String violationType;

    private Double fineAmount;

    private String location;

    private String status;

    private LocalDateTime timestamp;
}