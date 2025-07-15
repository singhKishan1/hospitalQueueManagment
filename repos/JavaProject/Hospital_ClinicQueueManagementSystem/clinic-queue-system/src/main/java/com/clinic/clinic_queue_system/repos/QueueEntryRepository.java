package com.clinic.clinic_queue_system.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinic.clinic_queue_system.documents.QueueEntry;

public interface QueueEntryRepository extends JpaRepository<QueueEntry, Long> {
    int countByDepartmentAndStatus(String department, String status);

    List<QueueEntry> findByDepartmentAndStatusOrderByQueueNumber(String department, String status);
}
