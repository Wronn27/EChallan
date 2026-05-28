package org.markandey.echallan.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Violation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String violationType;

    private Double fineAmount;
}