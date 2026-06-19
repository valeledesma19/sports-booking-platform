package com.valentina.sportsbooking.feature.canchas.services;

import com.valentina.sportsbooking.exceptions.NotFoundException;
import com.valentina.sportsbooking.feature.canchas.dto.request.ActualizarCanchaRequest;
import com.valentina.sportsbooking.feature.canchas.dto.request.CrearCanchaRequest;
import com.valentina.sportsbooking.feature.canchas.dto.response.CanchaResponse;
import com.valentina.sportsbooking.feature.canchas.model.Cancha;
import com.valentina.sportsbooking.feature.canchas.repository.CanchaRepository;
import com.valentina.sportsbooking.feature.deportes.model.Deporte;
import com.valentina.sportsbooking.feature.deportes.services.DeporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CanchaService {

    private final CanchaRepository canchaRepository;
    private final DeporteService deporteService;

    public CanchaResponse crearCancha(CrearCanchaRequest request) {

        Deporte deporte = deporteService.buscarDeportePorId(request.getDeporteId());

        Cancha cancha = Cancha.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .precioPorHora(request.getPrecioPorHora())
                .activa(request.getActiva() != null ? request.getActiva() : true)
                .deporte(deporte)
                .build();

        Cancha canchaGuardada = canchaRepository.save(cancha);

        return mapToResponse(canchaGuardada);
    }

    public List<CanchaResponse> listarCanchas() {
        return canchaRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<CanchaResponse> listarCanchasActivas() {
        return canchaRepository.findByActivaTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<CanchaResponse> listarCanchasPorDeporte(Long deporteId) {
        return canchaRepository.findByDeporteIdAndActivaTrue(deporteId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CanchaResponse obtenerCanchaPorId(Long id) {
        Cancha cancha = buscarCanchaPorId(id);
        return mapToResponse(cancha);
    }

    public CanchaResponse actualizarCancha(Long id, ActualizarCanchaRequest request) {

        Cancha cancha = buscarCanchaPorId(id);
        Deporte deporte = deporteService.buscarDeportePorId(request.getDeporteId());

        cancha.setNombre(request.getNombre());
        cancha.setDescripcion(request.getDescripcion());
        cancha.setPrecioPorHora(request.getPrecioPorHora());
        cancha.setActiva(request.getActiva());
        cancha.setDeporte(deporte);

        Cancha canchaActualizada = canchaRepository.save(cancha);

        return mapToResponse(canchaActualizada);
    }

    public void eliminarCancha(Long id) {

        Cancha cancha = buscarCanchaPorId(id);

        cancha.setActiva(false);

        canchaRepository.save(cancha);
    }

    public Cancha buscarCanchaPorId(Long id) {
        return canchaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("La cancha no existe"));
    }

    private CanchaResponse mapToResponse(Cancha cancha) {
        return CanchaResponse.builder()
                .id(cancha.getId())
                .nombre(cancha.getNombre())
                .descripcion(cancha.getDescripcion())
                .precioPorHora(cancha.getPrecioPorHora())
                .activa(cancha.getActiva())
                .deporteId(cancha.getDeporte().getId())
                .deporteNombre(cancha.getDeporte().getNombre())
                .build();
    }
}