package com.bloodcare.web;

import com.bloodcare.model.BloodStock;
import com.bloodcare.repo.BloodStockRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class BloodStockController {

    private final BloodStockRepository stockRepo;

    public BloodStockController(BloodStockRepository stockRepo) {
        this.stockRepo = stockRepo;
    }

    @GetMapping
    public ResponseEntity<List<BloodStock>> list() {
        return ResponseEntity.ok(stockRepo.findAll());
    }

    @PutMapping("/{bloodGroup}")
    public ResponseEntity<BloodStock> update(@PathVariable String bloodGroup, @RequestParam int units) {
        BloodStock stock = stockRepo.findByBloodGroupIgnoreCase(bloodGroup)
                .orElseGet(() -> {
                    BloodStock s = new BloodStock();
                    s.setBloodGroup(bloodGroup);
                    s.setUnits(0);
                    return s;
                });
        stock.setUnits(Math.max(0, units));
        return ResponseEntity.ok(stockRepo.save(stock));
    }
} 