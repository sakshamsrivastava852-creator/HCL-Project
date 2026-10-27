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

import com.hcl.harvest.hub.entity.Farm;
import com.hcl.harvest.hub.service.FarmService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/farms")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class FarmController {

    private final FarmService farmService;

    public FarmController(FarmService farmService) {
        this.farmService = farmService;
    }

    @PostMapping
    public ResponseEntity<Farm> addFarm(@Valid @RequestBody Farm farm) {
        return new ResponseEntity<>(farmService.addFarm(farm), HttpStatus.CREATED);
    }

    @GetMapping
    public List<Farm> getAllFarms() {
        return farmService.getAllFarms();
    }

    @GetMapping("/{id}")
    public Farm getFarmById(@PathVariable Long id) {
        return farmService.getFarmById(id);
    }

    @PutMapping("/{id}")
    public Farm updateFarm(@PathVariable Long id, @Valid @RequestBody Farm farm) {
        return farmService.updateFarm(id, farm);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteFarm(@PathVariable Long id) {
        farmService.deleteFarm(id);
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Farm deleted successfully");
        resp.put("id", id);
        return ResponseEntity.ok(resp);
    }
}
