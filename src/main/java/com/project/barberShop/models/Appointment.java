package com.project.barberShop.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;


import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @NotNull
    @DateTimeFormat(pattern = "HH:mm")
    private LocalTime time;

    @ManyToMany(fetch = FetchType.LAZY)
    @JsonManagedReference
//    @JoinTable(name = "appointment_services",
//            joinColumns = @JoinColumn(name = "appointment_id"),
//            inverseJoinColumns = @JoinColumn(name = "service_id"))
    @JoinColumn(name = "service_id")
    private Set<BarberService> service = new HashSet<>();

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference  // Add this annotation here.
//    @JoinTable(name = "user_appointment",
//            joinColumns = @JoinColumn(name = "appointment_id"),
//            inverseJoinColumns = @JoinColumn(name = "user_id"))
    @JoinColumn(name = "user_id")
    private User user;
}
