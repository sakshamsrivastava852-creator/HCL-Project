package com.hcl.harvest.hub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hcl.harvest.hub.entity.Farm;

@Repository
public interface FarmRepository extends JpaRepository<Farm, Long> {
}
