package com.bloodcare.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "donor_id")
    private Long donorId;

    @NotBlank
    @Column(name = "blood_type")
    private String bloodType;

    @Min(1)
    private Integer units; // units collected in this donation

    @Column(name = "camp_name")
    private String campName;

    @Column(name = "donated_at")
    private LocalDateTime donatedAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDonorId() { return donorId; }
    public void setDonorId(Long donorId) { this.donorId = donorId; }
    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }
    public Integer getUnits() { return units; }
    public void setUnits(Integer units) { this.units = units; }
    public String getCampName() { return campName; }
    public void setCampName(String campName) { this.campName = campName; }
    public LocalDateTime getDonatedAt() { return donatedAt; }
    public void setDonatedAt(LocalDateTime donatedAt) { this.donatedAt = donatedAt; }
} 