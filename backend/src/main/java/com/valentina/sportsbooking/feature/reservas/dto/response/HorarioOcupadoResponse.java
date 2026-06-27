package com.valentina.sportsbooking.feature.reservas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HorarioOcupadoResponse {

    private String horaInicio;
    private String horaFin;
}