package com.example.blooddonorregistry.bloodgroup.dto;
import jakarta.validation.constraints.*;
public record BloodGroupRequest(@NotBlank @Pattern(regexp="^(A|B|AB|O)[+-]$", message="Use a valid blood group such as O+") String name) {}
