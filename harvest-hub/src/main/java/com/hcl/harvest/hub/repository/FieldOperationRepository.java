package com.hcl.harvest.hub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hcl.harvest.hub.entity.FieldOperation;

@Repository
public interface FieldOperationRepository extends JpaRepository<FieldOperation, Long> {
    List<FieldOperation> findByFieldId(Long fieldId);
    List<FieldOperation> findByCropPlanId(Long cropPlanId);
}
