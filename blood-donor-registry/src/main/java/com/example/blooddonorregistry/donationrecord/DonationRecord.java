package com.example.blooddonorregistry.donationrecord;
import com.example.blooddonorregistry.donor.Donor;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Table(name="donation_records") @Getter @Setter @NoArgsConstructor
public class DonationRecord {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.EAGER,optional=false) @JoinColumn(name="donor_id",nullable=false) private Donor donor;
 @Column(nullable=false) private LocalDate donationDate;
 @Column(length=500) private String notes;
}
