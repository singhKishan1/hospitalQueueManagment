package com.clinic.clinic_queue_system.documents;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int age;
    private String phone;
    private String email;
    private LocalDateTime registeredAt;

    public Patient(String name, int age, String phone, String email, LocalDateTime registeredAt) {
        this.name = name;
        this.age = age;
        this.phone = phone;
        this.email = email;
        this.registeredAt = registeredAt;
    }
}
