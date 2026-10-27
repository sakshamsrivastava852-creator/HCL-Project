package com.hcl.harvest.hub.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.hcl.harvest.hub.entity.FieldOperation;
import com.hcl.harvest.hub.service.FieldOperationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = {"/api/field-operations", "/api/operations"})
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class FieldOperationController {

    private final FieldOperationService fieldOperationService;

    public FieldOperationController(FieldOperationService fieldOperationService) {
        this.fieldOperationService = fieldOperationService;
    }

    @PostMapping
    public ResponseEntity<FieldOperation> addFieldOperation(@Valid @RequestBody FieldOperation fieldOperation) {
        return new ResponseEntity<>(fieldOperationService.addFieldOperation(fieldOperation), HttpStatus.CREATED);
    }

    @GetMapping
    public List<FieldOperation> getAllFieldOperations() {
        return fieldOperationService.getAllFieldOperations();
    }

    @GetMapping("/{id}")
    public FieldOperation getFieldOperationById(@PathVariable Long id) {
        return fieldOperationService.getFieldOperationById(id);
    }

    @PutMapping("/{id}")
    public FieldOperation updateFieldOperation(@PathVariable Long id, @Valid @RequestBody FieldOperation fieldOperation) {
        return fieldOperationService.updateFieldOperation(id, fieldOperation);
    }

    @PatchMapping("/{id}/status")
    public FieldOperation updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }
        return fieldOperationService.updateStatus(id, status.trim().toUpperCase());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteFieldOperation(@PathVariable Long id) {
        fieldOperationService.deleteFieldOperation(id);
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Field operation deleted successfully");
        resp.put("id", id);
        return ResponseEntity.ok(resp);
    }
}
