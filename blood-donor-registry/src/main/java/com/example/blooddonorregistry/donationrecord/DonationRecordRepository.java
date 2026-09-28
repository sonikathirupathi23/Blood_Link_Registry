package com.example.blooddonorregistry.donationrecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
public interface DonationRecordRepository extends JpaRepository<DonationRecord,Long> {
 List<DonationRecord> findByDonorIdOrderByDonationDateDesc(Long donorId);
 boolean existsByDonorIdAndDonationDate(Long donorId, LocalDate donationDate);
}
