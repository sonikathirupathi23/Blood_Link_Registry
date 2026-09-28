package com.example.blooddonorregistry.donor;
import com.example.blooddonorregistry.bloodgroup.*;
import com.example.blooddonorregistry.donor.dto.*;
import com.example.blooddonorregistry.exception.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
@Service
public class DonorService {
 private final DonorRepository donors; private final BloodGroupRepository groups;
 public DonorService(DonorRepository donors,BloodGroupRepository groups){this.donors=donors;this.groups=groups;}
 public DonorResponse create(DonorRequest r){if(donors.existsByEmailIgnoreCase(r.email().trim()))throw new BusinessRuleException("A donor with this email already exists."); Donor d=new Donor();apply(d,r);return response(donors.save(d));}
 public DonorResponse update(Long id,DonorRequest r){Donor d=find(id);if(donors.existsByEmailIgnoreCaseAndIdNot(r.email().trim(),id))throw new BusinessRuleException("Another donor already uses this email.");apply(d,r);return response(donors.save(d));}
 public DonorResponse get(Long id){return response(find(id));}
 public List<DonorResponse> list(){return donors.findAll().stream().map(this::response).toList();}
 public List<DonorResponse> search(String group,String city){List<Donor> matches;if(group!=null&&!group.isBlank()&&city!=null&&!city.isBlank())matches=donors.findByBloodGroup_NameIgnoreCaseAndCityIgnoreCase(group.trim(),city.trim());else if(group!=null&&!group.isBlank())matches=donors.findByBloodGroup_NameIgnoreCase(group.trim());else if(city!=null&&!city.isBlank())matches=donors.findByCityIgnoreCase(city.trim());else matches=donors.findAll();return matches.stream().filter(Donor::isAvailable).map(this::response).toList();}
 public void delete(Long id){Donor d=find(id);if(!d.getDonationRecords().isEmpty())throw new BusinessRuleException("Cannot delete a donor with donation records.");donors.delete(d);}
 private Donor find(Long id){return donors.findById(id).orElseThrow(()->new ResourceNotFoundException("Donor not found with id "+id));}
 private void apply(Donor d,DonorRequest r){d.setFullName(r.fullName().trim());d.setEmail(r.email().trim());d.setPhone(r.phone().trim());d.setCity(r.city().trim());d.setLastDonationDate(r.lastDonationDate());d.setBloodGroup(groups.findById(r.bloodGroupId()).orElseThrow(()->new ResourceNotFoundException("Blood group not found with id "+r.bloodGroupId())));}
 private DonorResponse response(Donor d){return new DonorResponse(d.getId(),d.getFullName(),d.getEmail(),d.getPhone(),d.getCity(),d.getBloodGroup().getId(),d.getBloodGroup().getName(),d.getLastDonationDate(),d.isAvailable());}
}
