package com.dinehub.dinehubbackend.exceptions.handlers;

import com.dinehub.dinehubbackend.dto.ErrorResponseDTO;
import com.dinehub.dinehubbackend.exceptions.restaurant.DuplicateRestaurantException;
import com.dinehub.dinehubbackend.exceptions.restaurant.RestaurantNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestaurantExceptionHandler extends ResponseEntityExceptionHandler {

    private final String RESTAURANT_NOT_FOUND = "RESTAURANT_NOT_FOUND";
    private final String DUPLICATE_RESTAURANT = "DUPLICATE_RESTAURANT";

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

}
