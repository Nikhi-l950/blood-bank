package com.bloodcare.repo;

import com.bloodcare.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    List<Donor> findByBloodTypeIgnoreCase(String bloodType);
    List<Donor> findByBloodTypeIgnoreCaseAndCityIgnoreCase(String bloodType, String city);
    List<Donor> findByBloodTypeIgnoreCaseAndStateIgnoreCase(String bloodType, String state);
    List<Donor> findByBloodTypeIgnoreCaseAndPincode(String bloodType, String pincode);
} 