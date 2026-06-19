package com.valentina.sportsbooking.feature.deportes.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class DeporteResponse {

    private Long id;
    private String nombre;
}