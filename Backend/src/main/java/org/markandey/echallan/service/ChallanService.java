package org.markandey.echallan.service;

import org.markandey.echallan.dto.ChallanRequest;
import org.markandey.echallan.entity.Challan;
import org.markandey.echallan.repository.ChallanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChallanService {

    private final ChallanRepository repo;

    public Challan createChallan(
            ChallanRequest request) {

        Challan challan = new Challan();

        challan.setVehicleNumber(request.getVehicleNumber());
        challan.setViolationType(request.getViolationType());
        challan.setFineAmount(request.getFineAmount());
        challan.setLocation(request.getLocation());
        challan.setStatus("UNPAID");
        challan.setTimestamp(LocalDateTime.now());

        return repo.save(challan);
    }

    public List<Challan> getAllChallans() {
        return repo.findAll();
    }

    public Challan getChallanById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Challan not found"));
    }

    public List<Challan> getVehicleChallans(
            String vehicleNumber) {

        return repo.findByVehicleNumber(vehicleNumber);
    }
}