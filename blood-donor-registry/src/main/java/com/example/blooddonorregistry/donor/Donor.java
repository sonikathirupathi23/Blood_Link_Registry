package com.example.blooddonorregistry.donor;
import com.example.blooddonorregistry.bloodgroup.BloodGroup;
import com.example.blooddonorregistry.donationrecord.DonationRecord;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.*;
@Entity @Table(name="donors") @Getter @Setter @NoArgsConstructor
public class Donor {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String fullName;
 @Column(nullable=false,unique=true) private String email;
 @Column(nullable=false) private String phone;
 @Column(nullable=false) private String city;
 @Column(nullable=false) private LocalDate lastDonationDate;
 @ManyToOne(fetch=FetchType.EAGER,optional=false) @JoinColumn(name="blood_group_id",nullable=false) private BloodGroup bloodGroup;
 @OneToMany(mappedBy="donor") private List<DonationRecord> donationRecords=new ArrayList<>();
 @Transient public boolean isAvailable(){return lastDonationDate==null || !lastDonationDate.plusDays(90).isAfter(LocalDate.now());}
}
