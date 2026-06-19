package com.valentina.sportsbooking.feature.deportes.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CrearDeporteRequest {

    @NotBlank(message = "El nombre del deporte es obligatorio")
    private String nombre;
}