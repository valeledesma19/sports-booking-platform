package com.valentina.sportsbooking.feature.reservas.model;

import com.valentina.sportsbooking.feature.canchas.model.Cancha;
import com.valentina.sportsbooking.feature.usuarios.model.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "reservas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;

    private LocalTime horaInicio;

    private LocalTime horaFin;

    @Enumerated(EnumType.STRING)
    private EstadoReserva estado;

    private LocalDateTime fechaCreacion;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "cancha_id")
    private Cancha cancha;
}