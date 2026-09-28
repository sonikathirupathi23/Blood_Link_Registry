package com.example.blooddonorregistry.donationrecord.dto;
import java.time.LocalDate;
public record DonationRecordResponse(Long id,Long donorId,String donorName,String bloodGroup,LocalDate donationDate,String notes) {}
