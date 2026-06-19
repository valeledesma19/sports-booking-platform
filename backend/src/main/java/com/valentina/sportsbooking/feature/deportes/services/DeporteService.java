package com.valentina.sportsbooking.feature.deportes.services;

import com.valentina.sportsbooking.exceptions.BadRequestException;
import com.valentina.sportsbooking.exceptions.NotFoundException;
import com.valentina.sportsbooking.feature.deportes.dto.request.CrearDeporteRequest;
import com.valentina.sportsbooking.feature.deportes.dto.response.DeporteResponse;
import com.valentina.sportsbooking.feature.deportes.model.Deporte;
import com.valentina.sportsbooking.feature.deportes.repository.DeporteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeporteService {

    private final DeporteRepository deporteRepository;

    public DeporteResponse crearDeporte(CrearDeporteRequest request) {

        if (deporteRepository.existsByNombre(request.getNombre())) {
            throw new BadRequestException("Ya existe un deporte con ese nombre");
        }

        Deporte deporte = Deporte.builder()
                .nombre(request.getNombre())
                .build();

        Deporte deporteGuardado = deporteRepository.save(deporte);

        return mapToResponse(deporteGuardado);
    }

    public List<DeporteResponse> listarDeportes() {
        return deporteRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public DeporteResponse obtenerDeportePorId(Long id) {
        Deporte deporte = buscarDeportePorId(id);
        return mapToResponse(deporte);
    }

    public Deporte buscarDeportePorId(Long id) {
        return deporteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("El deporte no existe"));
    }

    private DeporteResponse mapToResponse(Deporte deporte) {
        return DeporteResponse.builder()
                .id(deporte.getId())
                .nombre(deporte.getNombre())
                .build();
    }
}