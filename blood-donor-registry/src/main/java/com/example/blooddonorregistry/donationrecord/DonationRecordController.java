package com.example.blooddonorregistry.donationrecord;
import com.example.blooddonorregistry.donationrecord.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/donation-records")
public class DonationRecordController {
 private final DonationRecordService service;public DonationRecordController(DonationRecordService service){this.service=service;}
 @PostMapping public ResponseEntity<DonationRecordResponse> create(@Valid @RequestBody DonationRecordRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));}
 @GetMapping public List<DonationRecordResponse> list(@RequestParam(required=false) Long donorId){return service.list(donorId);}
}
