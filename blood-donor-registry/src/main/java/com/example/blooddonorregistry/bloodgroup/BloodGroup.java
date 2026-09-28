package com.example.blooddonorregistry.bloodgroup;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
@Entity @Table(name="blood_groups") @Getter @Setter @NoArgsConstructor
public class BloodGroup {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @NotBlank @Pattern(regexp="^(A|B|AB|O)[+-]$", message="Blood group must be one of A+, A-, B+, B-, AB+, AB-, O+, O-")
    @Column(nullable=false, unique=true, length=3) private String name;
}
