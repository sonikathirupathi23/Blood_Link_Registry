package com.example.blooddonorregistry.donor.dto;
import java.time.LocalDate;
public record DonorResponse(Long id,String fullName,String email,String phone,String city,Long bloodGroupId,String bloodGroup,LocalDate lastDonationDate,boolean available) {}
