package com.example.blooddonorregistry.donor;
import com.example.blooddonorregistry.bloodgroup.BloodGroupRepository;
import com.example.blooddonorregistry.bloodgroup.dto.BloodGroupResponse;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
@RestController @RequestMapping("/api/donors/summary")
public class DonorSummaryController {
 private final BloodGroupRepository groups;private final DonorRepository donors;
 public DonorSummaryController(BloodGroupRepository groups,DonorRepository donors){this.groups=groups;this.donors=donors;}
 @GetMapping("/by-blood-group") public List<BloodGroupResponse> counts(){return groups.findAll().stream().map(g->new BloodGroupResponse(g.getId(),g.getName(),donors.countByBloodGroupId(g.getId()))).toList();}
 @GetMapping("/available-by-blood-group") public List<AvailableCount> available(){LocalDate threshold=LocalDate.now().minusDays(90);return groups.findAll().stream().map(g->new AvailableCount(g.getId(),g.getName(),donors.countAvailableByBloodGroup(g.getId(),threshold))).toList();}
 public record AvailableCount(Long bloodGroupId,String bloodGroup,long availableDonors){}
}
