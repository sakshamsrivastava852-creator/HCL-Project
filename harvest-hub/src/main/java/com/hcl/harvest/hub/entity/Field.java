package com.hcl.harvest.hub.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Entity
public class Field {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Field name is required")
    private String name;

    @Positive(message = "Field area must be greater than zero")
    private double area;

    @NotBlank(message = "Soil type is required")
    private String soilType;

    @ManyToOne
    @JoinColumn(name = "farm_id")
    private Farm farm;

    @OneToMany(mappedBy = "field", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Crop> crops = new ArrayList<>();

    @OneToMany(mappedBy = "field", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<CropPlan> cropPlans = new ArrayList<>();

    @OneToMany(mappedBy = "field", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<FieldOperation> fieldOperations = new ArrayList<>();

    public Field() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getArea() {
        return area;
    }

    public void setArea(double area) {
        this.area = area;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public Farm getFarm() {
        return farm;
    }

    public void setFarm(Farm farm) {
        this.farm = farm;
    }

    public List<Crop> getCrops() {
        return crops;
    }

    public void setCrops(List<Crop> crops) {
        this.crops = crops;
    }

    public List<CropPlan> getCropPlans() {
        return cropPlans;
    }

    public void setCropPlans(List<CropPlan> cropPlans) {
        this.cropPlans = cropPlans;
    }

    public List<FieldOperation> getFieldOperations() {
        return fieldOperations;
    }

    public void setFieldOperations(List<FieldOperation> fieldOperations) {
        this.fieldOperations = fieldOperations;
    }
}
