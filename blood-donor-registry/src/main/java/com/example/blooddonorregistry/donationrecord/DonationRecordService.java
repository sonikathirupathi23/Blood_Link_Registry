package com.example.blooddonorregistry.donationrecord;
import com.example.blooddonorregistry.donor.*;
import com.example.blooddonorregistry.exception.*;
import com.example.blooddonorregistry.donationrecord.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;
@Service
public class DonationRecordService {
 private final DonationRecordRepository records;private final DonorRepository donors;
 public DonationRecordService(DonationRecordRepository records,DonorRepository donors){this.records=records;this.donors=donors;}
 @Transactional public DonationRecordResponse create(DonationRecordRequest r){Donor d=donors.findById(r.donorId()).orElseThrow(()->new ResourceNotFoundException("Donor not found with id "+r.donorId()));if(r.donationDate().isBefore(d.getLastDonationDate().plusDays(90)))throw new BusinessRuleException("Donor is in the 90-day cooldown. Earliest next donation date is "+d.getLastDonationDate().plusDays(90)+".");if(records.existsByDonorIdAndDonationDate(d.getId(),r.donationDate()))throw new BusinessRuleException("A donation record already exists for this donor on this date.");DonationRecord record=new DonationRecord();record.setDonor(d);record.setDonationDate(r.donationDate());record.setNotes(r.notes());d.setLastDonationDate(r.donationDate());donors.save(d);return response(records.save(record));}
 public List<DonationRecordResponse> list(Long donorId){if(donorId!=null&&!donors.existsById(donorId))throw new ResourceNotFoundException("Donor not found with id "+donorId);List<DonationRecord> list=donorId==null?records.findAll():records.findByDonorIdOrderByDonationDateDesc(donorId);return list.stream().map(this::response).toList();}
 private DonationRecordResponse response(DonationRecord r){return new DonationRecordResponse(r.getId(),r.getDonor().getId(),r.getDonor().getFullName(),r.getDonor().getBloodGroup().getName(),r.getDonationDate(),r.getNotes());}
}
