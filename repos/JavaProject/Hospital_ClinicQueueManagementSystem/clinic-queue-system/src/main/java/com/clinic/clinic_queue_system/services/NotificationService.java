package com.clinic.clinic_queue_system.services;

import org.springframework.stereotype.Service;

import com.clinic.clinic_queue_system.documents.Patient;

@Service
public class NotificationService {
    public void notifyPatient(Patient patient) {
        // Print simulation
        System.out.println("================ NOTIFICATION ================");
        System.out.println("[EMAIL] To: " + patient.getEmail());
        System.out.println("Subject: You are being called now!");
        System.out.println("Message: Dear " + patient.getName() + ", please proceed to your department.");
        System.out.println("[SMS] To: " + patient.getPhone());
        System.out.println("Message: Hello " + patient.getName() + ", you are now being called. Please proceed.");
        System.out.println("==============================================");
        // You can integrate Twilio or JavaMailSender here
    }
}
