package com.valentina.sportsbooking.feature.deportes.controllers;

import com.valentina.sportsbooking.feature.deportes.dto.request.CrearDeporteRequest;
import com.valentina.sportsbooking.feature.deportes.dto.response.DeporteResponse;
import com.valentina.sportsbooking.feature.deportes.services.DeporteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deportes")
@RequiredArgsConstructor
public class DeporteController {

    private final DeporteService deporteService;

    @PostMapping
    public ResponseEntity<DeporteResponse> crearDeporte(
            @Valid @RequestBody CrearDeporteRequest request
    ) {
        DeporteResponse response = deporteService.crearDeporte(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<DeporteResponse>> listarDeportes() {
        List<DeporteResponse> deportes = deporteService.listarDeportes();
        return ResponseEntity.ok(deportes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeporteResponse> obtenerDeportePorId(
            @PathVariable Long id
    ) {
        DeporteResponse deporte = deporteService.obtenerDeportePorId(id);
        return ResponseEntity.ok(deporte);
    }
}