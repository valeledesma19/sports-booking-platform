package com.valentina.sportsbooking.auth.dto;

import com.valentina.sportsbooking.feature.usuarios.model.Rol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private Long usuarioId;
    private String nombre;
    private String email;
    private Rol rol;
}