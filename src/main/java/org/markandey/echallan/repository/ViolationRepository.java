package org.markandey.echallan.repository;

import org.markandey.echallan.entity.Violation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViolationRepository
        extends JpaRepository<Violation, Long> {
}