package com.valentina.sportsbooking.feature.canchas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class CanchaResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precioPorHora;
    private Boolean activa;

    private Long deporteId;
    private String deporteNombre;
}