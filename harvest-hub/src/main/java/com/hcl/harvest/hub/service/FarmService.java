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
public class FarmService {

    private final FarmRepository farmRepository;
    private final FieldRepository fieldRepository;
    private final CropRepository cropRepository;
    private final CropPlanRepository cropPlanRepository;
    private final FieldOperationRepository fieldOperationRepository;

    public FarmService(FarmRepository farmRepository,
                       FieldRepository fieldRepository,
                       CropRepository cropRepository,
                       CropPlanRepository cropPlanRepository,
                       FieldOperationRepository fieldOperationRepository) {
        this.farmRepository = farmRepository;
        this.fieldRepository = fieldRepository;
        this.cropRepository = cropRepository;
        this.cropPlanRepository = cropPlanRepository;
        this.fieldOperationRepository = fieldOperationRepository;
    }

    public Farm addFarm(Farm farm) {
        return farmRepository.save(farm);
    }

    public List<Farm> getAllFarms() {
        return farmRepository.findAll();
    }

    public Farm getFarmById(Long id) {
        return farmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + id));
    }

    public Farm updateFarm(Long id, Farm updated) {
        Farm existing = getFarmById(id);
        existing.setName(updated.getName());
        existing.setLocation(updated.getLocation());
        existing.setTotalArea(updated.getTotalArea());
        return farmRepository.save(existing);
    }

    @Transactional
    public void deleteFarm(Long id) {
        Farm farm = getFarmById(id);
        List<Field> fields = fieldRepository.findByFarmId(id);
        for (Field f : fields) {
            List<FieldOperation> ops = fieldOperationRepository.findByFieldId(f.getId());
            fieldOperationRepository.deleteAll(ops);
            
            List<CropPlan> plans = cropPlanRepository.findByFieldId(f.getId());
            fieldOperationRepository.deleteAll(fieldOperationRepository.findAll().stream()
                    .filter(op -> op.getCropPlan() != null && plans.stream().anyMatch(p -> p.getId().equals(op.getCropPlan().getId())))
                    .toList());
            cropPlanRepository.deleteAll(plans);

            List<Crop> crops = cropRepository.findByFieldId(f.getId());
            cropRepository.deleteAll(crops);
            
            fieldRepository.delete(f);
        }
        farmRepository.delete(farm);
    }
}
