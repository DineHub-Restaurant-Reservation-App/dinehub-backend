package com.dinehub.dinehubbackend.services.impl;

import com.dinehub.dinehubbackend.dao.UserDao;
import com.dinehub.dinehubbackend.dto.*;
import com.dinehub.dinehubbackend.entities.Restaurant;
import com.dinehub.dinehubbackend.entities.Role;
import com.dinehub.dinehubbackend.entities.User;
import com.dinehub.dinehubbackend.exceptions.restaurant.DuplicateRestaurantException;
import com.dinehub.dinehubbackend.exceptions.user.InvalidCredentialsException;
import com.dinehub.dinehubbackend.exceptions.user.DuplicateUserException;
import com.dinehub.dinehubbackend.services.AuthService;
import com.dinehub.dinehubbackend.services.JwtTokenService;
import com.dinehub.dinehubbackend.services.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final RestaurantService restaurantService;
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final AuthenticationManager authenticationManager;


    @Override
    public AuthenticationResponseDTO register(RegisterRequestDTO request) {

            User user = User.builder()
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.BUSINESS)
                    .build();

            if(userDao.existsByEmail(user.getEmail())){
                throw new DuplicateUserException("Email address already existing!");
            }

            if(restaurantService.isRestaurantAlreadyExisting(request.getRestaurantName())){
                throw new DuplicateRestaurantException();
            }

            User savedUser = userDao.save(user);

            Restaurant restaurant = Restaurant.builder()
                    .restaurantId(savedUser.getId())
                    .name(request.getRestaurantName())
                    .email(request.getEmail())
                    .build();

            restaurantService.createRestaurant(restaurant);

            String token = jwtTokenService.generateToken(user);


            String tokenExpirationTimeInMilliS = String.valueOf(jwtTokenService.extractTokenExpirationTime(token).getTime());

            return AuthenticationResponseDTO.builder()
                    .token(token)
                    .email(user.getEmail())
                    .userId(user.getId())
                    .expiresIn(tokenExpirationTimeInMilliS)
                    .build();
    }

    @Override
    public AuthenticationResponseDTO login(LoginRequestDTO request) throws AuthenticationException{

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));
        User user = userDao.findByEmail(request.getEmail())
                           .orElseThrow(() -> new InvalidCredentialsException("Invalid login credentials!"));

        String token = jwtTokenService.generateToken(user);

        String tokenExpirationTimeInMilliS = String.valueOf(jwtTokenService.extractTokenExpirationTime(token).getTime());

        return AuthenticationResponseDTO.builder()
                .token(token)
                .email(user.getEmail())
                .userId(user.getId())
                .expiresIn(tokenExpirationTimeInMilliS)
                .build();
    }
}

