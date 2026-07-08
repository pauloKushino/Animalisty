package com.animalisty.controller;

import com.animalisty.dto.AuthResponse;
import com.animalisty.dto.LoginRequest;
import com.animalisty.dto.RegisterRequest;
import com.animalisty.entity.User;
import com.animalisty.repository.UserRepository;
import com.animalisty.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(AuthResponse.builder()
                            .token(null)
                            .user(Map.of("message", "Email já cadastrado"))
                            .build());
        }

        if (userRepository.existsByName(request.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(AuthResponse.builder()
                            .token(null)
                            .user(Map.of("message", "Nome de usuário já em uso"))
                            .build());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("ROLE_USER")
                .build();

        userRepository.save(user);

        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getName());
        claims.put("role", user.getRole());

        String token = jwtService.generateToken(user.getEmail(), claims);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(AuthResponse.builder()
                        .token(token)
                        .user(userData)
                        .build());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getName());
        claims.put("role", user.getRole());

        String token = jwtService.generateToken(user.getEmail(), claims);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .user(userData)
                .build());
    }
}
