package com.coreinventory.repositories;

import com.coreinventory.models.ReorderRule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReorderRuleRepository extends JpaRepository<ReorderRule, Long> {
}
