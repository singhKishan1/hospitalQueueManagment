package com.clinic.clinic_queue_system.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinic.clinic_queue_system.documents.QueueEntry;
import com.clinic.clinic_queue_system.services.PatientService;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping("/register")
    public ResponseEntity<?> registerPatient(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        int age = Integer.parseInt(request.get("age"));
        String phone = request.get("phone");
        String email = request.get("email");
        String department = request.get("department");

        QueueEntry entry = patientService.registerPatient(name, age, phone, email, department);

        return ResponseEntity.ok(Map.of(
                "queueNumber", entry.getQueueNumber(),
                "department", entry.getDepartment(),
                "status", entry.getStatus()));
    }

}
