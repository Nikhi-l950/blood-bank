package com.bloodcare.web;

import com.bloodcare.model.BloodStock;
import com.bloodcare.model.Donation;
import com.bloodcare.repo.BloodStockRepository;
import com.bloodcare.repo.DonationRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonationController {

    private final DonationRepository donationRepo;
    private final BloodStockRepository stockRepo;

    public DonationController(DonationRepository donationRepo, BloodStockRepository stockRepo) {
        this.donationRepo = donationRepo;
        this.stockRepo = stockRepo;
    }

    @PostMapping
    public ResponseEntity<Donation> create(@RequestBody @Valid Donation donation) {
        Donation saved = donationRepo.save(donation);
        // Update stock
        BloodStock stock = stockRepo.findByBloodGroupIgnoreCase(donation.getBloodType())
                .orElseGet(() -> {
                    BloodStock s = new BloodStock();
                    s.setBloodGroup(donation.getBloodType());
                    s.setUnits(0);
                    return s;
                });
        stock.setUnits(Math.max(0, (stock.getUnits() == null ? 0 : stock.getUnits()) + donation.getUnits()));
        stockRepo.save(stock);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Donation>> list() {
        return ResponseEntity.ok(donationRepo.findAll());
    }
} 