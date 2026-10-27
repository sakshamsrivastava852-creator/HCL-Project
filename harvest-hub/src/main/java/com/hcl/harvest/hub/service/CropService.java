package com.hcl.harvest.hub.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hcl.harvest.hub.entity.Crop;
import com.hcl.harvest.hub.entity.CropPlan;
import com.hcl.harvest.hub.entity.Field;
import com.hcl.harvest.hub.exception.ResourceNotFoundException;
import com.hcl.harvest.hub.repository.CropPlanRepository;
import com.hcl.harvest.hub.repository.CropRepository;
import com.hcl.harvest.hub.repository.FieldRepository;

@Service
public class CropService {

    private final CropRepository cropRepository;
    private final FieldRepository fieldRepository;
    private final CropPlanRepository cropPlanRepository;

    public CropService(CropRepository cropRepository,
                       FieldRepository fieldRepository,
                       CropPlanRepository cropPlanRepository) {
        this.cropRepository = cropRepository;
        this.fieldRepository = fieldRepository;
        this.cropPlanRepository = cropPlanRepository;
    }

    public Crop addCrop(Crop crop) {
        if (crop.getField() != null && crop.getField().getId() != null) {
            Field field = fieldRepository.findById(crop.getField().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + crop.getField().getId()));
            crop.setField(field);
        }
        return cropRepository.save(crop);
    }

    public List<Crop> getAllCrops() {
        return cropRepository.findAll();
    }

    public Crop getCropById(Long id) {
        return cropRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + id));
    }

    public Crop updateCrop(Long id, Crop updated) {
        Crop existing = getCropById(id);
        existing.setName(updated.getName());
        existing.setSeason(updated.getSeason());
        existing.setPlantingDate(updated.getPlantingDate());
        existing.setExpectedYield(updated.getExpectedYield());
        if (updated.getField() != null && updated.getField().getId() != null) {
            Field field = fieldRepository.findById(updated.getField().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + updated.getField().getId()));
            existing.setField(field);
        }
        return cropRepository.save(existing);
    }

    @Transactional
    public void deleteCrop(Long id) {
        Crop crop = getCropById(id);
        // Cascade delete or clear reference in crop plans
        List<CropPlan> plans = cropPlanRepository.findByCropId(id);
        for (CropPlan p : plans) {
            p.setCrop(null);
            cropPlanRepository.save(p);
        }
        cropRepository.delete(crop);
    }
}
