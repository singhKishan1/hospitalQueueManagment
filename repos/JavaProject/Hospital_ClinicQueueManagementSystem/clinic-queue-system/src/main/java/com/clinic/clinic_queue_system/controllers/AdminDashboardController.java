package com.clinic.clinic_queue_system.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinic.clinic_queue_system.documents.QueueEntry;
import com.clinic.clinic_queue_system.repos.QueueEntryRepository;
import com.clinic.clinic_queue_system.services.NotificationService;

// AdminDashboardController.java
@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    @Autowired
    private QueueEntryRepository queueEntryRepository;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/queue/{department}/{status}")
    public List<QueueEntry> getWaitingPatients(@PathVariable String department, @PathVariable String status) {

        List<QueueEntry> list = queueEntryRepository.findByDepartmentAndStatusOrderByQueueNumber(department, status.toUpperCase());
        System.out.println(list.toString());
        return list;
    }

    @PutMapping("/queue/status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> req) {
        String newStatus = req.get("status");
        QueueEntry entry = queueEntryRepository.findById(id).orElseThrow();
        entry.setStatus(newStatus);
        queueEntryRepository.save(entry);
        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }

    @PostMapping("/queue/next/{department}")
    public ResponseEntity<?> callNextPatient(@PathVariable String department) {
        List<QueueEntry> waitingList = queueEntryRepository.findByDepartmentAndStatusOrderByQueueNumber("WAITING",
                department);

        if (waitingList.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No patients in queue"));
        }

        QueueEntry current = waitingList.get(0);
        current.setStatus("CALLED");
        queueEntryRepository.save(current);

        notificationService.notifyPatient(current.getPatient());

        return ResponseEntity.ok(Map.of(
                "queueNumber", current.getQueueNumber(),
                "patientName", current.getPatient().getName(),
                "message", "Next patient called"));
    }
}
