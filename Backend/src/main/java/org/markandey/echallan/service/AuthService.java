package org.markandey.echallan.service;

import org.markandey.echallan.dto.AuthRequest;
import org.markandey.echallan.entity.User;
import org.markandey.echallan.repository.UserRepository;
import org.markandey.echallan.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public String register(AuthRequest request) {

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "CITIZEN"); // ← use request role
        repo.save(user);
        return jwtUtil.generateToken(user.getEmail(), user.getRole());
    }

    public String login(AuthRequest request) {

        User user = repo.findByEmail(request.getEmail())
                .orElseThrow();

        if (!encoder.matches(
                request.getPassword(),
                user.getPassword()))
            throw new RuntimeException("Invalid password");

        return jwtUtil.generateToken(user.getEmail(), user.getRole());
    }
}