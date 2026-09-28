package com.example.blooddonorregistry.exception;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import java.time.LocalDateTime;
import java.util.*;
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class) public ResponseEntity<Map<String,Object>> notFound(ResourceNotFoundException e) { return response(HttpStatus.NOT_FOUND,e.getMessage()); }
    @ExceptionHandler(BusinessRuleException.class) public ResponseEntity<Map<String,Object>> business(BusinessRuleException e) { return response(HttpStatus.BAD_REQUEST,e.getMessage()); }
    @ExceptionHandler(MethodArgumentNotValidException.class) public ResponseEntity<Map<String,Object>> validation(MethodArgumentNotValidException e) {
        Map<String,String> errors=new LinkedHashMap<>(); e.getBindingResult().getFieldErrors().forEach(x->errors.put(x.getField(),x.getDefaultMessage()));
        Map<String,Object> body=new LinkedHashMap<>(); body.put("timestamp",LocalDateTime.now()); body.put("status",400); body.put("error","Validation failed"); body.put("details",errors); return ResponseEntity.badRequest().body(body);
    }
    @ExceptionHandler(DataIntegrityViolationException.class) public ResponseEntity<Map<String,Object>> conflict(DataIntegrityViolationException e) { return response(HttpStatus.CONFLICT,"The request conflicts with existing data."); }
    @ExceptionHandler(Exception.class) public ResponseEntity<Map<String,Object>> other(Exception e) { return response(HttpStatus.INTERNAL_SERVER_ERROR,"An unexpected server error occurred."); }
    private ResponseEntity<Map<String,Object>> response(HttpStatus status,String message) { Map<String,Object> b=new LinkedHashMap<>(); b.put("timestamp",LocalDateTime.now()); b.put("status",status.value()); b.put("error",status.getReasonPhrase()); b.put("message",message); return ResponseEntity.status(status).body(b); }
}
