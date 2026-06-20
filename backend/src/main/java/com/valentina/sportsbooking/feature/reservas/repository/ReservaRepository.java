package com.valentina.sportsbooking.feature.reservas.repository;

import com.valentina.sportsbooking.feature.reservas.model.EstadoReserva;
import com.valentina.sportsbooking.feature.reservas.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByUsuarioId(Long usuarioId);

    List<Reserva> findByCanchaId(Long canchaId);

    List<Reserva> findByEstado(EstadoReserva estado);

    List<Reserva> findByFecha(LocalDate fecha);

    List<Reserva> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);

    Long countByFecha(LocalDate fecha);

    Long countByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);

    Long countByEstado(EstadoReserva estado);

    @Query("""
            SELECT COUNT(r) > 0
            FROM Reserva r
            WHERE r.cancha.id = :canchaId
            AND r.fecha = :fecha
            AND r.estado <> :estadoCancelada
            AND (:horaInicio < r.horaFin AND :horaFin > r.horaInicio)
            """)
    boolean existeReservaSuperpuesta(
            @Param("canchaId") Long canchaId,
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin,
            @Param("estadoCancelada") EstadoReserva estadoCancelada
    );
}