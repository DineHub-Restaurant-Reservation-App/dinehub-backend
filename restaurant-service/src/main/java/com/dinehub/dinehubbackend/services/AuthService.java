package com.dinehub.dinehubbackend.services;

import com.dinehub.dinehubbackend.dto.*;

public interface AuthService {

    public AuthenticationResponseDTO register(RegisterRequestDTO registerRequestDTO);

    public AuthenticationResponseDTO login(LoginRequestDTO request) ;
}
