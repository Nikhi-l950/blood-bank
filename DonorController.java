package com.bloodcare.web;

import com.bloodcare.model.Donor;
import com.bloodcare.repo.DonorRepository;
import com.bloodcare.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin(origins = "*")
public class DonorController {

    private final DonorRepository donorRepository;
    private final NotificationService notificationService;

    public DonorController(DonorRepository donorRepository, NotificationService notificationService) {
        this.donorRepository = donorRepository;
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<Donor> register(@RequestBody @Valid Donor donor) {
        Donor saved = donorRepository.save(donor);
        notificationService.sendRegistrationConfirmation(saved);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Donor>> list() {
        return ResponseEntity.ok(donorRepository.findAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Donor>> search(
            @RequestParam String bloodType,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String pincode
    ) {
        if (city != null && !city.isBlank()) {
            return ResponseEntity.ok(donorRepository.findByBloodTypeIgnoreCaseAndCityIgnoreCase(bloodType, city));
        }
        if (state != null && !state.isBlank()) {
            return ResponseEntity.ok(donorRepository.findByBloodTypeIgnoreCaseAndStateIgnoreCase(bloodType, state));
        }
        if (pincode != null && !pincode.isBlank()) {
            return ResponseEntity.ok(donorRepository.findByBloodTypeIgnoreCaseAndPincode(bloodType, pincode));
        }
        return ResponseEntity.ok(donorRepository.findByBloodTypeIgnoreCase(bloodType));
    }
} 