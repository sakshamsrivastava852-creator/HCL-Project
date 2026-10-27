package com.hcl.harvest.hub.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hcl.harvest.hub.entity.Crop;
import com.hcl.harvest.hub.entity.CropPlan;
import com.hcl.harvest.hub.entity.Farm;
import com.hcl.harvest.hub.entity.Field;
import com.hcl.harvest.hub.entity.FieldOperation;
import com.hcl.harvest.hub.exception.ResourceNotFoundException;
import com.hcl.harvest.hub.repository.CropPlanRepository;
import com.hcl.harvest.hub.repository.CropRepository;
import com.hcl.harvest.hub.repository.FarmRepository;
import com.hcl.harvest.hub.repository.FieldOperationRepository;
import com.hcl.harvest.hub.repository.FieldRepository;

@Service
public class FieldService {

    private final FieldRepository fieldRepository;
    private final FarmRepository farmRepository;
    private final CropRepository cropRepository;
    private final CropPlanRepository cropPlanRepository;
    private final FieldOperationRepository fieldOperationRepository;

    public FieldService(FieldRepository fieldRepository,
                        FarmRepository farmRepository,
                        CropRepository cropRepository,
                        CropPlanRepository cropPlanRepository,
                        FieldOperationRepository fieldOperationRepository) {
        this.fieldRepository = fieldRepository;
        this.farmRepository = farmRepository;
        this.cropRepository = cropRepository;
        this.cropPlanRepository = cropPlanRepository;
        this.fieldOperationRepository = fieldOperationRepository;
    }

    public Field addField(Field field) {
        if (field.getFarm() != null && field.getFarm().getId() != null) {
            Farm farm = farmRepository.findById(field.getFarm().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + field.getFarm().getId()));
            field.setFarm(farm);
        }
        return fieldRepository.save(field);
    }

    public List<Field> getAllFields() {
        return fieldRepository.findAll();
    }

    public Field getFieldById(Long id) {
        return fieldRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + id));
    }

    public Field updateField(Long id, Field updated) {
        Field existing = getFieldById(id);
        existing.setName(updated.getName());
        existing.setArea(updated.getArea());
        existing.setSoilType(updated.getSoilType());
        if (updated.getFarm() != null && updated.getFarm().getId() != null) {
            Farm farm = farmRepository.findById(updated.getFarm().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + updated.getFarm().getId()));
            existing.setFarm(farm);
        }
        return fieldRepository.save(existing);
    }

    @Transactional
    public void deleteField(Long id) {
        Field field = getFieldById(id);
        
        // Remove field operations
        List<FieldOperation> ops = fieldOperationRepository.findByFieldId(id);
        fieldOperationRepository.deleteAll(ops);

        // Remove crop plans referencing this field
        List<CropPlan> plans = cropPlanRepository.findByFieldId(id);
        fieldOperationRepository.deleteAll(fieldOperationRepository.findAll().stream()
                .filter(op -> op.getCropPlan() != null && plans.stream().anyMatch(p -> p.getId().equals(op.getCropPlan().getId())))
                .toList());
        cropPlanRepository.deleteAll(plans);

        // Remove crops referencing this field
        List<Crop> crops = cropRepository.findByFieldId(id);
        cropRepository.deleteAll(crops);

        fieldRepository.delete(field);
    }
}
