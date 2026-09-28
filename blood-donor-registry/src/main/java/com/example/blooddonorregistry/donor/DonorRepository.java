package com.example.blooddonorregistry.donor;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;
public interface DonorRepository extends JpaRepository<Donor,Long> {
 boolean existsByEmailIgnoreCase(String email);
 boolean existsByEmailIgnoreCaseAndIdNot(String email,Long id);
 List<Donor> findByBloodGroup_NameIgnoreCaseAndCityIgnoreCase(String bloodGroup,String city);
 List<Donor> findByBloodGroup_NameIgnoreCase(String bloodGroup);
 List<Donor> findByCityIgnoreCase(String city);
 long countByBloodGroupId(Long bloodGroupId);
 @Query("select count(d) from Donor d where d.bloodGroup.id=:groupId and d.lastDonationDate <= :availableBefore") long countAvailableByBloodGroup(@Param("groupId") Long groupId,@Param("availableBefore") java.time.LocalDate availableBefore);
}
