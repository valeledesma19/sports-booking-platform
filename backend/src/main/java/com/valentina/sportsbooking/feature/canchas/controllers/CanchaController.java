package com.valentina.sportsbooking.feature.canchas.controllers;

import com.valentina.sportsbooking.feature.canchas.dto.request.ActualizarCanchaRequest;
import com.valentina.sportsbooking.feature.canchas.dto.request.CrearCanchaRequest;
import com.valentina.sportsbooking.feature.canchas.dto.response.CanchaResponse;
import com.valentina.sportsbooking.feature.canchas.services.CanchaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/canchas")
@RequiredArgsConstructor
public class CanchaController {

    private final CanchaService canchaService;

    @PostMapping
    public ResponseEntity<CanchaResponse> crearCancha(
            @Valid @RequestBody CrearCanchaRequest request
    ) {
        CanchaResponse response = canchaService.crearCancha(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CanchaResponse>> listarCanchas() {
        List<CanchaResponse> canchas = canchaService.listarCanchas();
        return ResponseEntity.ok(canchas);
    }

    @GetMapping("/activas")
    public ResponseEntity<List<CanchaResponse>> listarCanchasActivas() {
        List<CanchaResponse> canchas = canchaService.listarCanchasActivas();
        return ResponseEntity.ok(canchas);
    }

    @GetMapping("/deporte/{deporteId}")
    public ResponseEntity<List<CanchaResponse>> listarCanchasPorDeporte(
            @PathVariable Long deporteId
    ) {
        List<CanchaResponse> canchas = canchaService.listarCanchasPorDeporte(deporteId);
        return ResponseEntity.ok(canchas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CanchaResponse> obtenerCanchaPorId(
            @PathVariable Long id
    ) {
        CanchaResponse cancha = canchaService.obtenerCanchaPorId(id);
        return ResponseEntity.ok(cancha);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CanchaResponse> actualizarCancha(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarCanchaRequest request
    ) {
        CanchaResponse response = canchaService.actualizarCancha(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCancha(
            @PathVariable Long id
    ) {
        canchaService.eliminarCancha(id);
        return ResponseEntity.noContent().build();
    }
}