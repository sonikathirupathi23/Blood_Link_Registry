package com.example.blooddonorregistry.bloodgroup;
import com.example.blooddonorregistry.bloodgroup.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/blood-groups")
public class BloodGroupController {
 private final BloodGroupService service; public BloodGroupController(BloodGroupService service){this.service=service;}
 @GetMapping public List<BloodGroupResponse> all(){return service.getAll();}
 @PostMapping public ResponseEntity<BloodGroupResponse> create(@Valid @RequestBody BloodGroupRequest request){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));}
}
