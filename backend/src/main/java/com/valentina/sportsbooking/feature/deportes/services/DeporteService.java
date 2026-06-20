package com.valentina.sportsbooking.feature.deportes.services;

import com.valentina.sportsbooking.exceptions.BadRequestException;
import com.valentina.sportsbooking.exceptions.NotFoundException;
import com.valentina.sportsbooking.feature.canchas.repository.CanchaRepository;
import com.valentina.sportsbooking.feature.deportes.dto.request.ActualizarDeporteRequest;
import com.valentina.sportsbooking.feature.deportes.dto.request.CrearDeporteRequest;
import com.valentina.sportsbooking.feature.deportes.dto.response.DeporteResponse;
import com.valentina.sportsbooking.feature.deportes.model.Deporte;
import com.valentina.sportsbooking.feature.deportes.repository.DeporteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeporteService {

    private final DeporteRepository deporteRepository;
    private final CanchaRepository canchaRepository;

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

    public DeporteResponse actualizarDeporte(Long id, ActualizarDeporteRequest request) {

        Deporte deporte = buscarDeportePorId(id);

        Optional<Deporte> deporteConMismoNombre = deporteRepository.findByNombre(request.getNombre());

        if (deporteConMismoNombre.isPresent()
                && !deporteConMismoNombre.get().getId().equals(id)) {
            throw new BadRequestException("Ya existe otro deporte con ese nombre");
        }

        deporte.setNombre(request.getNombre());

        Deporte deporteActualizado = deporteRepository.save(deporte);

        return mapToResponse(deporteActualizado);
    }

    public void eliminarDeporte(Long id) {

        Deporte deporte = buscarDeportePorId(id);

        boolean tieneCanchas = canchaRepository.existsByDeporteId(id);

        if (tieneCanchas) {
            throw new BadRequestException("No se puede eliminar el deporte porque tiene canchas asociadas");
        }

        deporteRepository.delete(deporte);
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