package com.valentina.sportsbooking.feature.dashboard.controllers;

import com.valentina.sportsbooking.feature.dashboard.dto.response.DashboardResponse;
import com.valentina.sportsbooking.feature.dashboard.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/resumen")
    public ResponseEntity<DashboardResponse> obtenerResumen() {
        DashboardResponse response = dashboardService.obtenerResumen();
        return ResponseEntity.ok(response);
    }
}