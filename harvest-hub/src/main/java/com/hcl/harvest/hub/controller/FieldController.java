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

import com.hcl.harvest.hub.entity.Field;
import com.hcl.harvest.hub.service.FieldService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/fields")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class FieldController {

    private final FieldService fieldService;

    public FieldController(FieldService fieldService) {
        this.fieldService = fieldService;
    }

    @PostMapping
    public ResponseEntity<Field> addField(@Valid @RequestBody Field field) {
        return new ResponseEntity<>(fieldService.addField(field), HttpStatus.CREATED);
    }

    @GetMapping
    public List<Field> getAllFields() {
        return fieldService.getAllFields();
    }

    @GetMapping("/{id}")
    public Field getFieldById(@PathVariable Long id) {
        return fieldService.getFieldById(id);
    }

    @PutMapping("/{id}")
    public Field updateField(@PathVariable Long id, @Valid @RequestBody Field field) {
        return fieldService.updateField(id, field);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteField(@PathVariable Long id) {
        fieldService.deleteField(id);
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Field deleted successfully");
        resp.put("id", id);
        return ResponseEntity.ok(resp);
    }
}
