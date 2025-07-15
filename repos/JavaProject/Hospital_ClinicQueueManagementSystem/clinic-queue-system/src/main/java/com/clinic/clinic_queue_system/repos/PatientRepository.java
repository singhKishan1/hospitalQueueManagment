package com.clinic.clinic_queue_system.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinic.clinic_queue_system.documents.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {

}
