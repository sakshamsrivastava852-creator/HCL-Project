package com.hcl.harvest.hub.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hcl.harvest.hub.entity.Crop;
import com.hcl.harvest.hub.entity.CropPlan;
import com.hcl.harvest.hub.entity.Field;
import com.hcl.harvest.hub.entity.FieldOperation;
import com.hcl.harvest.hub.exception.ResourceNotFoundException;
import com.hcl.harvest.hub.repository.CropPlanRepository;
import com.hcl.harvest.hub.repository.CropRepository;
import com.hcl.harvest.hub.repository.FieldOperationRepository;
import com.hcl.harvest.hub.repository.FieldRepository;

@Service
public class CropPlanService {

    private final CropPlanRepository cropPlanRepository;
    private final FieldRepository fieldRepository;
    private final CropRepository cropRepository;
    private final FieldOperationRepository fieldOperationRepository;

    public CropPlanService(CropPlanRepository cropPlanRepository,
                           FieldRepository fieldRepository,
                           CropRepository cropRepository,
                           FieldOperationRepository fieldOperationRepository) {
        this.cropPlanRepository = cropPlanRepository;
        this.fieldRepository = fieldRepository;
        this.cropRepository = cropRepository;
        this.fieldOperationRepository = fieldOperationRepository;
    }

    public CropPlan addCropPlan(CropPlan cropPlan) {
        if (cropPlan.getField() != null && cropPlan.getField().getId() != null) {
            Field field = fieldRepository.findById(cropPlan.getField().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + cropPlan.getField().getId()));
            cropPlan.setField(field);
        }
        if (cropPlan.getCrop() != null && cropPlan.getCrop().getId() != null) {
            Crop crop = cropRepository.findById(cropPlan.getCrop().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + cropPlan.getCrop().getId()));
            cropPlan.setCrop(crop);
        }
        if (cropPlan.getStatus() == null || cropPlan.getStatus().trim().isEmpty()) {
            cropPlan.setStatus("PLANNED");
        }
        return cropPlanRepository.save(cropPlan);
    }

    public List<CropPlan> getAllCropPlans() {
        return cropPlanRepository.findAll();
    }

    public CropPlan getCropPlanById(Long id) {
        return cropPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crop plan not found with id: " + id));
    }

    public CropPlan updateCropPlan(Long id, CropPlan updated) {
        CropPlan existing = getCropPlanById(id);
        existing.setPlanName(updated.getPlanName());
        existing.setSeason(updated.getSeason());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        if (updated.getStatus() != null && !updated.getStatus().trim().isEmpty()) {
            existing.setStatus(updated.getStatus());
        }
        if (updated.getField() != null && updated.getField().getId() != null) {
            Field field = fieldRepository.findById(updated.getField().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + updated.getField().getId()));
            existing.setField(field);
        }
        if (updated.getCrop() != null && updated.getCrop().getId() != null) {
            Crop crop = cropRepository.findById(updated.getCrop().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + updated.getCrop().getId()));
            existing.setCrop(crop);
        }
        return cropPlanRepository.save(existing);
    }

    public CropPlan updateStatus(Long id, String status) {
        CropPlan existing = getCropPlanById(id);
        existing.setStatus(status);
        return cropPlanRepository.save(existing);
    }

    @Transactional
    public void deleteCropPlan(Long id) {
        CropPlan plan = getCropPlanById(id);
        List<FieldOperation> ops = fieldOperationRepository.findByCropPlanId(id);
        for (FieldOperation op : ops) {
            op.setCropPlan(null);
            fieldOperationRepository.save(op);
        }
        cropPlanRepository.delete(plan);
    }
}
