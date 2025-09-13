package com.bloodcare.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "blood_stock")
public class BloodStock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "blood_group", unique = true, nullable = false)
    private String bloodGroup; // e.g., A+, O-

    @Min(0)
    private Integer units; // units available

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public Integer getUnits() { return units; }
    public void setUnits(Integer units) { this.units = units; }
} 