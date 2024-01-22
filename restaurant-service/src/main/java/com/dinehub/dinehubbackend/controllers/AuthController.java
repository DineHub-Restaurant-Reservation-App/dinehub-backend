package com.dinehub.dinehubbackend.controllers;

import com.dinehub.dinehubbackend.dto.AuthenticationResponseDTO;
import com.dinehub.dinehubbackend.dto.LoginRequestDTO;
import com.dinehub.dinehubbackend.dto.RegisterRequestDTO;
import com.dinehub.dinehubbackend.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/restaurant_app/v1/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDTO> register(@RequestBody RegisterRequestDTO registerRequest){


        AuthenticationResponseDTO authenticationResponseDTO = authService.register(registerRequest);

        return ResponseEntity.ok(authenticationResponseDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(@RequestBody LoginRequestDTO loginRequest){
        AuthenticationResponseDTO authenticationResponseDTO = authService.login(loginRequest);
        return ResponseEntity.ok(authenticationResponseDTO);
    }
}
