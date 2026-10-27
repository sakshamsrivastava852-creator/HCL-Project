package com.hcl.harvest.hub.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.hcl.harvest.hub.entity.Crop;
import com.hcl.harvest.hub.service.CropService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/crops")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    @PostMapping
    public ResponseEntity<Crop> addCrop(@Valid @RequestBody Crop crop) {
        return new ResponseEntity<>(cropService.addCrop(crop), HttpStatus.CREATED);
    }

    @GetMapping
    public List<Crop> getAllCrops() {
        return cropService.getAllCrops();
    }

    @GetMapping("/{id}")
    public Crop getCropById(@PathVariable Long id) {
        return cropService.getCropById(id);
    }

    @PutMapping("/{id}")
    public Crop updateCrop(@PathVariable Long id, @Valid @RequestBody Crop crop) {
        return cropService.updateCrop(id, crop);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCrop(@PathVariable Long id) {
        cropService.deleteCrop(id);
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Crop deleted successfully");
        resp.put("id", id);
        return ResponseEntity.ok(resp);
    }
}
