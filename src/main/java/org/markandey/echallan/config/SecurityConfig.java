package org.markandey.echallan.config;

import org.markandey.echallan.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.*;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http) throws Exception {

        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/hello")
                        .permitAll()

                        .requestMatchers("/auth/**")
                        .permitAll()

                        .requestMatchers("/challan/create")
                        .hasAuthority("OFFICER")

                        .requestMatchers("/payment/pay")
                        .hasAuthority("CITIZEN")

                        .requestMatchers("/challan/all")
                        .hasAuthority("ADMIN")

                        .requestMatchers("/admin/**")
                        .hasAuthority("ADMIN")

                        .anyRequest()
                        .authenticated()
                )
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .build();
    }

    @Bean
    public BCryptPasswordEncoder encoder() {

        return new BCryptPasswordEncoder();
    }
}
