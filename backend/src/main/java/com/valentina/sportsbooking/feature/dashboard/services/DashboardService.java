package com.valentina.sportsbooking.feature.dashboard.services;

import com.valentina.sportsbooking.feature.dashboard.dto.response.DashboardResponse;
import com.valentina.sportsbooking.feature.reservas.model.EstadoReserva;
import com.valentina.sportsbooking.feature.reservas.model.Reserva;
import com.valentina.sportsbooking.feature.reservas.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ReservaRepository reservaRepository;

    public DashboardResponse obtenerResumen() {

        LocalDate hoy = LocalDate.now();

        LocalDate inicioMes = hoy.withDayOfMonth(1);
        LocalDate finMes = hoy.withDayOfMonth(hoy.lengthOfMonth());

        Long reservasHoy = reservaRepository.countByFecha(hoy);

        Long reservasMes = reservaRepository.countByFechaBetween(inicioMes, finMes);

        Long reservasPendientes = reservaRepository.countByEstado(EstadoReserva.PENDIENTE);

        Long reservasCanceladas = reservaRepository.countByEstado(EstadoReserva.CANCELADA);

        List<Reserva> reservasDelMes = reservaRepository.findByFechaBetween(inicioMes, finMes);

        BigDecimal ingresosEstimadosMes = calcularIngresosEstimados(reservasDelMes);

        String canchaMasReservada = obtenerCanchaMasReservada(reservasDelMes);

        return DashboardResponse.builder()
                .reservasHoy(reservasHoy)
                .reservasMes(reservasMes)
                .reservasPendientes(reservasPendientes)
                .reservasCanceladas(reservasCanceladas)
                .ingresosEstimadosMes(ingresosEstimadosMes)
                .canchaMasReservada(canchaMasReservada)
                .build();
    }

    private BigDecimal calcularIngresosEstimados(List<Reserva> reservas) {

        return reservas.stream()
                .filter(reserva -> reserva.getEstado() == EstadoReserva.CONFIRMADA)
                .map(this::calcularPrecioReserva)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calcularPrecioReserva(Reserva reserva) {

        long minutos = Duration.between(
                reserva.getHoraInicio(),
                reserva.getHoraFin()
        ).toMinutes();

        BigDecimal horas = BigDecimal.valueOf(minutos)
                .divide(BigDecimal.valueOf(60));

        return reserva.getCancha()
                .getPrecioPorHora()
                .multiply(horas);
    }

    private String obtenerCanchaMasReservada(List<Reserva> reservas) {

        return reservas.stream()
                .filter(reserva -> reserva.getEstado() != EstadoReserva.CANCELADA)
                .collect(Collectors.groupingBy(
                        reserva -> reserva.getCancha().getNombre(),
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Sin reservas");
    }
}