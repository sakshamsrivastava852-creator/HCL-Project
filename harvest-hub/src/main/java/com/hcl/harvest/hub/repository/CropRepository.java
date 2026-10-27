package com.hcl.harvest.hub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hcl.harvest.hub.entity.Crop;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    List<Crop> findByFieldId(Long fieldId);
}
