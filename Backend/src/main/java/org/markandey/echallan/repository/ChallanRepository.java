package org.markandey.echallan.repository;

import org.markandey.echallan.entity.Challan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChallanRepository
        extends JpaRepository<Challan, Long> {

    List<Challan> findByVehicleNumber(String vehicleNumber);

    long countByStatus(String status);
}
