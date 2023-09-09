package com.project.barberShop.requestresponse;

import com.project.barberShop.models.EBarberService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
public class AvailableSlotsRequest {

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private EBarberService eBarberService;
}
