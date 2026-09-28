package com.example.blooddonorregistry.donationrecord.dto;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
public record DonationRecordRequest(@NotNull Long donorId,@NotNull @PastOrPresent LocalDate donationDate,@Size(max=500) String notes) {}
