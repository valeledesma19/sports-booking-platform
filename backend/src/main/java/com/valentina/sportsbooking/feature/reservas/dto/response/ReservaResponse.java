package com.valentina.sportsbooking.feature.reservas.dto.response;

import com.valentina.sportsbooking.feature.reservas.model.EstadoReserva;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class ReservaResponse {

    private Long id;

    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    private EstadoReserva estado;
    private LocalDateTime fechaCreacion;

    private Long usuarioId;
    private String usuarioNombre;
    private String usuarioEmail;

    private Long canchaId;
    private String canchaNombre;

    private Long deporteId;
    private String deporteNombre;
}