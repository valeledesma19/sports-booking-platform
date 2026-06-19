package com.valentina.sportsbooking.feature.canchas.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CrearCanchaRequest {

    @NotBlank(message = "El nombre de la cancha es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El precio por hora es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private BigDecimal precioPorHora;

    private Boolean activa = true;

    @NotNull(message = "El deporte es obligatorio")
    private Long deporteId;
}