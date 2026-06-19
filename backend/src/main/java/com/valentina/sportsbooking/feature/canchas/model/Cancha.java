package com.valentina.sportsbooking.feature.canchas.model;
import com.valentina.sportsbooking.feature.deportes.model.Deporte;
import com.valentina.sportsbooking.feature.reservas.model.Reserva;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "canchas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cancha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String descripcion;

    private BigDecimal precioPorHora;

    private Boolean activa;

    @ManyToOne
    @JoinColumn(name = "deporte_id")
    private Deporte deporte;

    @OneToMany(mappedBy = "cancha")
    private List<Reserva> reservas = new ArrayList<>();
}