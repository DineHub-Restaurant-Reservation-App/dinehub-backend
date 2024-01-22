package com.dinehub.dinehubbackend.services;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;

public interface JwtTokenService {

    String extractUserName(String token);

    String generateToken(UserDetails userDetails);

    Date extractTokenExpirationTime(String token);

    boolean isTokenValid(String token, UserDetails userDetails);

}
