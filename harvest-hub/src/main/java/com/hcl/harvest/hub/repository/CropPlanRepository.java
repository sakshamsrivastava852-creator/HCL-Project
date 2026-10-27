package com.hcl.harvest.hub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hcl.harvest.hub.entity.CropPlan;

@Repository
public interface CropPlanRepository extends JpaRepository<CropPlan, Long> {
    List<CropPlan> findByFieldId(Long fieldId);
    List<CropPlan> findByCropId(Long cropId);
}
