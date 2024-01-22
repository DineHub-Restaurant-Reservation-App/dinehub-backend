package com.dinehub.dinehubbackend.exceptions.handlers;

import com.dinehub.dinehubbackend.dto.ErrorResponseDTO;
import com.dinehub.dinehubbackend.exceptions.token.InvalidTokenException;
import com.dinehub.dinehubbackend.exceptions.token.TokenGenerationException;
import com.dinehub.dinehubbackend.exceptions.user.DuplicateUserException;
import com.dinehub.dinehubbackend.exceptions.user.InvalidCredentialsException;
import com.dinehub.dinehubbackend.exceptions.restaurant.DuplicateRestaurantException;
import com.dinehub.dinehubbackend.exceptions.restaurant.RestaurantNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

    private final String RESTAURANT_NOT_FOUND = "RESTAURANT_NOT_FOUND";
    private final String DUPLICATE_RESTAURANT = "DUPLICATE_RESTAURANT";
    private final String USER_ALREADY_EXISTING = "USER_ALREADY_EXISTING";
    private final String INVALID_LOGIN_CREDENTIALS = "INVALID_LOGIN_CREDENTIALS";
    private final String TOKEN_GENERATION_FAILED = "TOKEN_GENERATION_FAILED";
    private final String INVALID_TOKEN = "INVALID_TOKEN";

    @ExceptionHandler(RestaurantNotFoundException.class)
    public final ResponseEntity handleRestaurantNotFoundException(RestaurantNotFoundException e){
        ErrorResponseDTO errorResponseDTO = ErrorResponseDTO.builder()
                .code(RESTAURANT_NOT_FOUND)
                .message(e.getLocalizedMessage())
                .build();
        return new ResponseEntity(errorResponseDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateRestaurantException.class)
    public final ResponseEntity handleDuplicateRestaurantException(DuplicateRestaurantException e){
        ErrorResponseDTO errorResponseDTO = ErrorResponseDTO.builder()
                .code(DUPLICATE_RESTAURANT)
                .message(e.getLocalizedMessage())
                .build();
        return new ResponseEntity(errorResponseDTO, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(DuplicateUserException.class)
    public final ResponseEntity handleUserAlreadyExistingException(DuplicateUserException e){

        ErrorResponseDTO errorResponseDTO = ErrorResponseDTO.builder()
                .code(USER_ALREADY_EXISTING)
                .message(e.getLocalizedMessage()).build();

        return new ResponseEntity(errorResponseDTO,HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public final ResponseEntity handleUserNotFoundException(InvalidCredentialsException e){
        ErrorResponseDTO errorResponseDTO = ErrorResponseDTO.builder()
                .code(INVALID_LOGIN_CREDENTIALS)
                .message(e.getLocalizedMessage())
                .build();
        return new ResponseEntity(errorResponseDTO, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(TokenGenerationException.class)
    public final ResponseEntity handleTokenGenerationException(TokenGenerationException e){
        ErrorResponseDTO errorResponseDTO = ErrorResponseDTO.builder()
                .code(TOKEN_GENERATION_FAILED)
                .message(e.getLocalizedMessage())
                .build();
        return new ResponseEntity(errorResponseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @ExceptionHandler(InvalidTokenException.class)
    public final ResponseEntity handleInvalidTokenException(InvalidCredentialsException e){
        ErrorResponseDTO errorResponseDTO = ErrorResponseDTO.builder()
                .code(INVALID_TOKEN)
                .message(e.getLocalizedMessage())
                .build();
        return new ResponseEntity(errorResponseDTO, HttpStatus.UNAUTHORIZED);
    }
}
