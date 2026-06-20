package com.valentina.sportsbooking.feature.dashboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private Long reservasHoy;
    private Long reservasMes;
    private Long reservasPendientes;
    private Long reservasCanceladas;

    private BigDecimal ingresosEstimadosMes;

    private String canchaMasReservada;
}