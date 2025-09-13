package com.bloodcare.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donors")
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "first_name")
    private String firstName;

    @NotBlank
    @Column(name = "last_name")
    private String lastName;

    @Email @NotBlank
    private String email;

    @NotBlank
    private String phone;

    @Min(18) @Max(65)
    private Integer age;

    @Min(40)
    @Column(name = "weight_kg")
    private Integer weightKg;

    @NotBlank
    @Column(name = "blood_type")
    private String bloodType;

    private String city;
    private String state;
    private String pincode;

    @Column(name = "preferred_camp")
    private String preferredCamp;

    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and setters omitted for brevity
    // Generate getters/setters in real project or use Lombok

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public Integer getWeightKg() { return weightKg; }
    public void setWeightKg(Integer weightKg) { this.weightKg = weightKg; }
    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public String getPreferredCamp() { return preferredCamp; }
    public void setPreferredCamp(String preferredCamp) { this.preferredCamp = preferredCamp; }
    public String getMedicalHistory() { return medicalHistory; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 