package com.hcl.harvest.hub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hcl.harvest.hub.entity.CropPlan;
import com.hcl.harvest.hub.entity.Field;
import com.hcl.harvest.hub.entity.FieldOperation;
import com.hcl.harvest.hub.exception.ResourceNotFoundException;
import com.hcl.harvest.hub.repository.CropPlanRepository;
import com.hcl.harvest.hub.repository.FieldOperationRepository;
import com.hcl.harvest.hub.repository.FieldRepository;

@Service
public class FieldOperationService {

    private final FieldOperationRepository fieldOperationRepository;
    private final FieldRepository fieldRepository;
    private final CropPlanRepository cropPlanRepository;

    public FieldOperationService(FieldOperationRepository fieldOperationRepository,
                                 FieldRepository fieldRepository,
                                 CropPlanRepository cropPlanRepository) {
        this.fieldOperationRepository = fieldOperationRepository;
        this.fieldRepository = fieldRepository;
        this.cropPlanRepository = cropPlanRepository;
    }

    public FieldOperation addFieldOperation(FieldOperation op) {
        if (op.getField() != null && op.getField().getId() != null) {
            Field field = fieldRepository.findById(op.getField().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + op.getField().getId()));
            op.setField(field);
        }
        if (op.getCropPlan() != null && op.getCropPlan().getId() != null) {
            CropPlan plan = cropPlanRepository.findById(op.getCropPlan().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Crop plan not found with id: " + op.getCropPlan().getId()));
            op.setCropPlan(plan);
        }
        if (op.getStatus() == null || op.getStatus().trim().isEmpty()) {
            op.setStatus("PLANNED");
        }
        return fieldOperationRepository.save(op);
    }

    public List<FieldOperation> getAllFieldOperations() {
        return fieldOperationRepository.findAll();
    }

    public FieldOperation getFieldOperationById(Long id) {
        return fieldOperationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Field operation not found with id: " + id));
    }

    public FieldOperation updateFieldOperation(Long id, FieldOperation updated) {
        FieldOperation existing = getFieldOperationById(id);
        existing.setOperationType(updated.getOperationType());
        existing.setOperationDate(updated.getOperationDate());
        existing.setDescription(updated.getDescription());
        existing.setCost(updated.getCost());
        if (updated.getStatus() != null && !updated.getStatus().trim().isEmpty()) {
            existing.setStatus(updated.getStatus());
        }
        if (updated.getField() != null && updated.getField().getId() != null) {
            Field field = fieldRepository.findById(updated.getField().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + updated.getField().getId()));
            existing.setField(field);
        }
        if (updated.getCropPlan() != null && updated.getCropPlan().getId() != null) {
            CropPlan plan = cropPlanRepository.findById(updated.getCropPlan().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Crop plan not found with id: " + updated.getCropPlan().getId()));
            existing.setCropPlan(plan);
        }
        return fieldOperationRepository.save(existing);
    }

    public FieldOperation updateStatus(Long id, String status) {
        FieldOperation existing = getFieldOperationById(id);
        existing.setStatus(status);
        return fieldOperationRepository.save(existing);
    }

    public void deleteFieldOperation(Long id) {
        FieldOperation op = getFieldOperationById(id);
        fieldOperationRepository.delete(op);
    }
}
