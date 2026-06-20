package com.valentina.sportsbooking.config;

import com.valentina.sportsbooking.auth.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // AUTH público
                        .requestMatchers("/api/auth/**").permitAll()

                        // Lectura pública
                        .requestMatchers(HttpMethod.GET, "/api/deportes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/canchas/**").permitAll()

                        .requestMatchers("/api/dashboard/**").hasRole("ADMIN")

                        // Deportes solo ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/deportes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/deportes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/deportes/**").hasRole("ADMIN")

                        // Canchas solo ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/canchas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/canchas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/canchas/**").hasRole("ADMIN")

                        // Reservas cliente o admin
                        .requestMatchers(HttpMethod.POST, "/api/reservas").hasAnyRole("CLIENTE", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reservas/mis-reservas").hasAnyRole("CLIENTE", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/reservas/*/cancelar").hasAnyRole("CLIENTE", "ADMIN")

                        // Reservas solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/reservas").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reservas/usuario/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reservas/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/reservas/*/confirmar").hasRole("ADMIN")

                        // Cualquier otra petición requiere login
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}