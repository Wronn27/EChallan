package org.markandey.echallan.controller;

import org.markandey.echallan.dto.ChallanRequest;
import org.markandey.echallan.entity.Challan;
import org.markandey.echallan.service.ChallanService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/challan")
@RequiredArgsConstructor
public class ChallanController {

    private final ChallanService service;


    // OFFICER creates challan
    @PreAuthorize("hasAuthority('OFFICER')")
    @PostMapping("/create")
    public Challan create(
            @RequestBody ChallanRequest request) {

        return service.createChallan(request);
    }


    // CITIZEN views challans by vehicle number
    @PreAuthorize("hasAnyAuthority('CITIZEN','OFFICER','ADMIN')")
    @GetMapping("/vehicle/{vehicleNumber}")
    public List<Challan> getByVehicle(
            @PathVariable String vehicleNumber) {

        return service.getVehicleChallans(vehicleNumber);
    }


    // ADMIN views all challans
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all")
    public List<Challan> getAllChallans() {

        return service.getAllChallans();
    }


    // Get challan by ID (any authenticated user)
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/id/{challanId}")
    public Challan getById(
            @PathVariable Long challanId) {

        return service.getChallanById(challanId);
    }
}
