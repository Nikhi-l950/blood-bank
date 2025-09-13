package com.bloodcare.repo;

import com.bloodcare.model.BloodStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BloodStockRepository extends JpaRepository<BloodStock, Long> {
    Optional<BloodStock> findByBloodGroupIgnoreCase(String bloodGroup);
} 