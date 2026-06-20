package com.valentina.sportsbooking.feature.reservas.controllers;

import com.valentina.sportsbooking.feature.reservas.dto.request.CrearReservaRequest;
import com.valentina.sportsbooking.feature.reservas.dto.response.ReservaResponse;
import com.valentina.sportsbooking.feature.reservas.services.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

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

    @PutMapping("/{id}/confirmar")
    public ResponseEntity<ReservaResponse> confirmarReserva(
            @PathVariable Long id
    ) {
        ReservaResponse response = reservaService.confirmarReserva(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<ReservaResponse> cancelarReserva(
            @PathVariable Long id
    ) {
        ReservaResponse response = reservaService.cancelarReserva(id);
        return ResponseEntity.ok(response);
    }
}