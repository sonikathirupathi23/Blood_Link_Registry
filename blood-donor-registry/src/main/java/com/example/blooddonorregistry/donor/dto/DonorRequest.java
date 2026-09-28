package com.example.blooddonorregistry.donor.dto;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
public record DonorRequest(@NotBlank @Size(max=100) String fullName,@NotBlank @Email @Size(max=150) String email,@NotBlank @Pattern(regexp="^[+0-9() -]{7,20}$",message="Enter a valid phone number") String phone,@NotBlank @Size(max=100) String city,@NotNull Long bloodGroupId,@NotNull @PastOrPresent LocalDate lastDonationDate) {}
