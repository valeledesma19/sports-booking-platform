package com.valentina.sportsbooking.feature.canchas.repository;

import com.valentina.sportsbooking.feature.canchas.model.Cancha;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CanchaRepository extends JpaRepository<Cancha, Long> {

    List<Cancha> findByActivaTrue();

    List<Cancha> findByDeporteId(Long deporteId);

    List<Cancha> findByDeporteIdAndActivaTrue(Long deporteId);
    boolean existsByDeporteId(Long deporteId);
}