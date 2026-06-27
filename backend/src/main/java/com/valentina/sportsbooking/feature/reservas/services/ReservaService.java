package com.valentina.sportsbooking.feature.reservas.services;

import com.valentina.sportsbooking.exceptions.BadRequestException;
import com.valentina.sportsbooking.exceptions.NotFoundException;
import com.valentina.sportsbooking.feature.canchas.model.Cancha;
import com.valentina.sportsbooking.feature.canchas.services.CanchaService;
import com.valentina.sportsbooking.feature.reservas.dto.request.CrearReservaRequest;
import com.valentina.sportsbooking.feature.reservas.dto.response.ReservaResponse;
import com.valentina.sportsbooking.feature.reservas.model.EstadoReserva;
import com.valentina.sportsbooking.feature.reservas.model.Reserva;
import com.valentina.sportsbooking.feature.reservas.repository.ReservaRepository;
import com.valentina.sportsbooking.feature.usuarios.model.Rol;
import com.valentina.sportsbooking.feature.usuarios.model.Usuario;
import com.valentina.sportsbooking.feature.usuarios.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final CanchaService canchaService;
    private final UsuarioRepository usuarioRepository;

    public ReservaResponse crearReserva(CrearReservaRequest request) {

        validarHorario(request);

        Usuario usuario = obtenerUsuarioAutenticado();

        Cancha cancha = canchaService.buscarCanchaPorId(request.getCanchaId());

        if (!Boolean.TRUE.equals(cancha.getActiva())) {
            throw new BadRequestException("La cancha no está disponible para reservas");
        }

        boolean existeReserva = reservaRepository.existeReservaSuperpuesta(
                request.getCanchaId(),
                request.getFecha(),
                request.getHoraInicio(),
                request.getHoraFin(),
                EstadoReserva.CANCELADA
        );

        if (existeReserva) {
            throw new BadRequestException("La cancha ya está reservada en ese horario");
        }

        Reserva reserva = Reserva.builder()
                .usuario(usuario)
                .cancha(cancha)
                .fecha(request.getFecha())
                .horaInicio(request.getHoraInicio())
                .horaFin(request.getHoraFin())
                .estado(EstadoReserva.PENDIENTE)
                .fechaCreacion(LocalDateTime.now())
                .build();

        Reserva reservaGuardada = reservaRepository.save(reserva);

        return mapToResponse(reservaGuardada);
    }

    public List<ReservaResponse> listarReservas() {
        return reservaRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReservaResponse> listarMisReservas() {

        Usuario usuario = obtenerUsuarioAutenticado();

        return reservaRepository.findByUsuarioId(usuario.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReservaResponse> listarReservasPorUsuario(Long usuarioId) {
        return reservaRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ReservaResponse obtenerReservaPorId(Long id) {
        Reserva reserva = buscarReservaPorId(id);
        return mapToResponse(reserva);
    }



    public ReservaResponse cancelarReserva(Long id) {

        Reserva reserva = buscarReservaPorId(id);
        Usuario usuario = obtenerUsuarioAutenticado();

        if (usuario.getRol() == Rol.CLIENTE &&
                !reserva.getUsuario().getId().equals(usuario.getId())) {
            throw new BadRequestException("No podés cancelar una reserva que no es tuya");
        }

        if (reserva.getEstado() == EstadoReserva.FINALIZADA) {
            throw new BadRequestException("Una reserva finalizada no puede cancelarse");
        }

        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new BadRequestException("La reserva ya está cancelada");
        }

        reserva.setEstado(EstadoReserva.CANCELADA);

        Reserva reservaActualizada = reservaRepository.save(reserva);

        return mapToResponse(reservaActualizada);
    }

    public Reserva buscarReservaPorId(Long id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("La reserva no existe"));
    }

    private Usuario obtenerUsuarioAutenticado() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("El usuario autenticado no existe"));
    }

    private void validarHorario(CrearReservaRequest request) {

        if (request.getHoraInicio().equals(request.getHoraFin())) {
            throw new BadRequestException("La hora de inicio y fin no pueden ser iguales");
        }

        if (request.getHoraInicio().isAfter(request.getHoraFin())) {
            throw new BadRequestException("La hora de inicio debe ser anterior a la hora de fin");
        }
    }

    private ReservaResponse mapToResponse(Reserva reserva) {
        return ReservaResponse.builder()
                .id(reserva.getId())
                .fecha(reserva.getFecha())
                .horaInicio(reserva.getHoraInicio())
                .horaFin(reserva.getHoraFin())
                .estado(reserva.getEstado())
                .fechaCreacion(reserva.getFechaCreacion())

                .usuarioId(reserva.getUsuario().getId())
                .usuarioNombre(reserva.getUsuario().getNombre())
                .usuarioEmail(reserva.getUsuario().getEmail())

                .canchaId(reserva.getCancha().getId())
                .canchaNombre(reserva.getCancha().getNombre())

                .deporteId(reserva.getCancha().getDeporte().getId())
                .deporteNombre(reserva.getCancha().getDeporte().getNombre())
                .build();
    }
    @Transactional
    public ReservaResponse confirmarReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new RuntimeException("No se puede confirmar una reserva cancelada");
        }

        if (reserva.getEstado() == EstadoReserva.FINALIZADA) {
            throw new RuntimeException("No se puede confirmar una reserva finalizada");
        }

        reserva.setEstado(EstadoReserva.CONFIRMADA);

        Reserva reservaGuardada = reservaRepository.save(reserva);

        return mapToResponse(reservaGuardada);
    }

    @Transactional
    public ReservaResponse finalizarReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new RuntimeException("No se puede finalizar una reserva cancelada");
        }

        reserva.setEstado(EstadoReserva.FINALIZADA);

        Reserva reservaGuardada = reservaRepository.save(reserva);

        return mapToResponse(reservaGuardada);
    }

}