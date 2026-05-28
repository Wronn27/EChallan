package org.markandey.echallan.controller;

import org.markandey.echallan.dto.AuthRequest;
import org.markandey.echallan.dto.AuthResponse;
import org.markandey.echallan.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody AuthRequest request) {

        return new AuthResponse(
                service.register(request));
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody AuthRequest request) {

        return new AuthResponse(
                service.login(request));
    }
}