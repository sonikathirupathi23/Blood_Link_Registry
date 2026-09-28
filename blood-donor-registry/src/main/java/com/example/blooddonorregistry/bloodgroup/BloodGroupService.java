package com.example.blooddonorregistry.bloodgroup;
import com.example.blooddonorregistry.bloodgroup.dto.*;
import com.example.blooddonorregistry.donor.DonorRepository;
import com.example.blooddonorregistry.exception.BusinessRuleException;
import org.springframework.stereotype.Service;
import java.util.*;
@Service
public class BloodGroupService {
 private final BloodGroupRepository repository; private final DonorRepository donors;
 public BloodGroupService(BloodGroupRepository repository,DonorRepository donors){this.repository=repository;this.donors=donors;}
 public List<BloodGroupResponse> getAll(){return repository.findAll().stream().map(this::toResponse).toList();}
 public BloodGroupResponse create(BloodGroupRequest request){String name=request.name().trim().toUpperCase(); if(repository.findByNameIgnoreCase(name).isPresent()) throw new BusinessRuleException("Blood group already exists: "+name); BloodGroup g=new BloodGroup();g.setName(name);return toResponse(repository.save(g));}
 private BloodGroupResponse toResponse(BloodGroup g){return new BloodGroupResponse(g.getId(),g.getName(),donors.countByBloodGroupId(g.getId()));}
}
