package com.clinic.clinic_queue_system.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinic.clinic_queue_system.documents.Patient;
import com.clinic.clinic_queue_system.documents.QueueEntry;
import com.clinic.clinic_queue_system.repos.PatientRepository;
import com.clinic.clinic_queue_system.repos.QueueEntryRepository;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private QueueEntryRepository queueEntryRepository;

    public QueueEntry registerPatient(String name, int age, String phone, String email, String department) {
        Patient patient = new Patient(name, age, phone, email, LocalDateTime.now());
        patient = patientRepository.save(patient);

        int currentQueueSize = queueEntryRepository.countByDepartmentAndStatus(department, "WAITING");

        QueueEntry queueEntry = new QueueEntry();
        queueEntry.setPatient(patient);
        queueEntry.setDepartment(department);
        queueEntry.setQueueNumber(currentQueueSize + 1);
        queueEntry.setStatus("WAITING");
        queueEntry.setCreatedAt(LocalDateTime.now());

        return queueEntryRepository.save(queueEntry);
    }
}
