package com.hcl.harvest.hub.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.hcl.harvest.hub.entity.CropPlan;
import com.hcl.harvest.hub.entity.Field;
import com.hcl.harvest.hub.entity.FieldOperation;
import com.hcl.harvest.hub.repository.CropPlanRepository;
import com.hcl.harvest.hub.repository.CropRepository;
import com.hcl.harvest.hub.repository.FarmRepository;
import com.hcl.harvest.hub.repository.FieldOperationRepository;
import com.hcl.harvest.hub.repository.FieldRepository;

@Service
public class DashboardService {

    private final FarmRepository farmRepository;
    private final FieldRepository fieldRepository;
    private final CropRepository cropRepository;
    private final CropPlanRepository cropPlanRepository;
    private final FieldOperationRepository fieldOperationRepository;

    public DashboardService(FarmRepository farmRepository,
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

    public Map<String, Object> getStats() {
        long totalFarms = farmRepository.count();
        long totalFields = fieldRepository.count();
        long totalCrops = cropRepository.count();
        
        List<Field> fields = fieldRepository.findAll();
        double totalArea = fields.stream().mapToDouble(Field::getArea).sum();

        List<CropPlan> cropPlans = cropPlanRepository.findAll();
        long totalCropPlans = cropPlans.size();
        long activeCropPlans = cropPlans.stream()
                .filter(p -> p.getStatus() != null && 
                             !p.getStatus().equalsIgnoreCase("COMPLETED") && 
                             !p.getStatus().equalsIgnoreCase("CANCELLED"))
                .count();

        List<FieldOperation> operations = fieldOperationRepository.findAll();
        long totalOperations = operations.size();
        long ongoingOperations = operations.stream()
                .filter(o -> o.getStatus() != null && 
                             (o.getStatus().equalsIgnoreCase("IN_PROGRESS") || 
                              o.getStatus().equalsIgnoreCase("PLANNED")))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFarms", totalFarms);
        stats.put("totalFields", totalFields);
        stats.put("totalArea", Math.round(totalArea * 10.0) / 10.0);
        stats.put("totalCrops", totalCrops);
        stats.put("totalCropPlans", totalCropPlans);
        stats.put("activeCropPlans", activeCropPlans);
        stats.put("totalOperations", totalOperations);
        stats.put("ongoingOperations", ongoingOperations);
        return stats;
    }
}
