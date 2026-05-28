package org.markandey.echallan.dto;

import lombok.Data;

@Data
public class ChallanRequest {

    private String vehicleNumber;

    private String violationType;

    private Double fineAmount;

    private String location;
}