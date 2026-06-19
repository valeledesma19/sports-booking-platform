package com.valentina.sportsbooking.feature.deportes.model;

import com.valentina.sportsbooking.feature.canchas.model.Cancha;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "deportes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @OneToMany(mappedBy = "deporte")
    private List<Cancha> canchas = new ArrayList<>();
}