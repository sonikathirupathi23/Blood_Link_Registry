package com.example.blooddonorregistry.donor;
import com.example.blooddonorregistry.donor.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/donors")
public class DonorController {
 private final DonorService service; public DonorController(DonorService service){this.service=service;}
 @PostMapping public ResponseEntity<DonorResponse> create(@Valid @RequestBody DonorRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));}
 @GetMapping public List<DonorResponse> list(@RequestParam(required=false) String bloodGroup,@RequestParam(required=false) String city){if(bloodGroup!=null||city!=null)return service.search(bloodGroup,city);return service.list();}
 @GetMapping("/{id}") public DonorResponse get(@PathVariable Long id){return service.get(id);}
 @PutMapping("/{id}") public DonorResponse update(@PathVariable Long id,@Valid @RequestBody DonorRequest r){return service.update(id,r);}
 @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){service.delete(id);return ResponseEntity.noContent().build();}
}
