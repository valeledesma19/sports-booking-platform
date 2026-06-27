package com.valentina.sportsbooking.feature.reservas.controllers;

import com.valentina.sportsbooking.feature.reservas.dto.request.CrearReservaRequest;
import com.valentina.sportsbooking.feature.reservas.dto.response.HorarioOcupadoResponse;
import com.valentina.sportsbooking.feature.reservas.dto.response.ReservaResponse;
import com.valentina.sportsbooking.feature.reservas.model.EstadoReserva;
import com.valentina.sportsbooking.feature.reservas.services.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.valentina.sportsbooking.feature.reservas.dto.response.HorarioOcupadoResponse;
import com.valentina.sportsbooking.feature.reservas.repository.ReservaRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;
    private final ReservaRepository reservaRepository;

    @PostMapping
    public ResponseEntity<ReservaResponse> crearReserva(
            @Valid @RequestBody CrearReservaRequest request
    ) {
        ReservaResponse response = reservaService.crearReserva(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ReservaResponse>> listarReservas() {
        List<ReservaResponse> reservas = reservaService.listarReservas();
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/mis-reservas")
    public ResponseEntity<List<ReservaResponse>> listarMisReservas() {
        List<ReservaResponse> reservas = reservaService.listarMisReservas();
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponse> obtenerReservaPorId(
            @PathVariable Long id
    ) {
        ReservaResponse reserva = reservaService.obtenerReservaPorId(id);
        return ResponseEntity.ok(reserva);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ReservaResponse>> listarReservasPorUsuario(
            @PathVariable Long usuarioId
    ) {
        List<ReservaResponse> reservas = reservaService.listarReservasPorUsuario(usuarioId);
        return ResponseEntity.ok(reservas);
    }


    @PatchMapping("/{id}/cancelar")
    public ReservaResponse cancelarReserva(@PathVariable Long id) {
        return reservaService.cancelarReserva(id);
    }

    @GetMapping("/ocupadas")
    public List<HorarioOcupadoResponse> obtenerHorariosOcupados(
            @RequestParam Long canchaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
    ) {
        return reservaRepository
                .findByCancha_IdAndFechaAndEstadoNot(canchaId, fecha, EstadoReserva.CANCELADA)
                .stream()
                .map(reserva -> new HorarioOcupadoResponse(
                        reserva.getHoraInicio().toString(),
                        reserva.getHoraFin().toString()
                ))
                .toList();
    }
    @PatchMapping("/{id}/confirmar")
    public ReservaResponse confirmarReserva(@PathVariable Long id) {
        return reservaService.confirmarReserva(id);
    }

    @PatchMapping("/{id}/finalizar")
    public ReservaResponse finalizarReserva(@PathVariable Long id) {
        return reservaService.finalizarReserva(id);
    }
}