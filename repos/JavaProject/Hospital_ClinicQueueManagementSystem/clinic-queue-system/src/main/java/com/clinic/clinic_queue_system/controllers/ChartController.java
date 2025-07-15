package com.clinic.clinic_queue_system.controllers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinic.clinic_queue_system.documents.QueueEntry;
import com.clinic.clinic_queue_system.repos.QueueEntryRepository;

@RestController
@RequestMapping("/api/stats")
public class ChartController {

    @Autowired
    private QueueEntryRepository queueEntryRepository;

    @GetMapping("/department-counts")
    public Map<String, Long> getDepartmentCounts() {
        List<QueueEntry> all = queueEntryRepository.findAll();
        return all.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getDepartment(),
                        Collectors.counting()));
    }

}
