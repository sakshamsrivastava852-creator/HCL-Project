package com.hcl.harvest.hub.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
public class FieldOperation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Operation type is required")
    private String operationType;

    @NotBlank(message = "Operation date is required")
    private String operationDate;

    private String description;

    @PositiveOrZero(message = "Cost must be positive or zero")
    private double cost;

    private String status = "PLANNED";

    @ManyToOne
    @JoinColumn(name = "field_id")
    private Field field;

    @ManyToOne
    @JoinColumn(name = "crop_plan_id")
    private CropPlan cropPlan;

    public FieldOperation() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public String getOperationDate() {
        return operationDate;
    }

    public void setOperationDate(String operationDate) {
        this.operationDate = operationDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
        this.cost = cost;
    }

    public String getStatus() {
        return (status == null || status.trim().isEmpty()) ? "PLANNED" : status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Field getField() {
        return field;
    }

    public void setField(Field field) {
        this.field = field;
    }

    public CropPlan getCropPlan() {
        return cropPlan;
    }

    public void setCropPlan(CropPlan cropPlan) {
        this.cropPlan = cropPlan;
    }
}
