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

import com.hcl.harvest.hub.entity.CropPlan;
import com.hcl.harvest.hub.service.CropPlanService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = {"/api/crop-plans", "/api/cropplans"})
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class CropPlanController {

    private final CropPlanService cropPlanService;

    public CropPlanController(CropPlanService cropPlanService) {
        this.cropPlanService = cropPlanService;
    }

    @PostMapping
    public ResponseEntity<CropPlan> addCropPlan(@Valid @RequestBody CropPlan cropPlan) {
        return new ResponseEntity<>(cropPlanService.addCropPlan(cropPlan), HttpStatus.CREATED);
    }

    @GetMapping
    public List<CropPlan> getAllCropPlans() {
        return cropPlanService.getAllCropPlans();
    }

    @GetMapping("/{id}")
    public CropPlan getCropPlanById(@PathVariable Long id) {
        return cropPlanService.getCropPlanById(id);
    }

    @PutMapping("/{id}")
    public CropPlan updateCropPlan(@PathVariable Long id, @Valid @RequestBody CropPlan cropPlan) {
        return cropPlanService.updateCropPlan(id, cropPlan);
    }

    @PatchMapping("/{id}/status")
    public CropPlan updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }
        return cropPlanService.updateStatus(id, status.trim().toUpperCase());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCropPlan(@PathVariable Long id) {
        cropPlanService.deleteCropPlan(id);
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Crop plan deleted successfully");
        resp.put("id", id);
        return ResponseEntity.ok(resp);
    }
}
