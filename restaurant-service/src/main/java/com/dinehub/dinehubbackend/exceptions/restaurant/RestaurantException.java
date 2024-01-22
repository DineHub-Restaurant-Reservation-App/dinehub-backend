package com.dinehub.dinehubbackend.exceptions.restaurant;

public class RestaurantException extends RuntimeException{
    public RestaurantException() {
        super("Error while creating restaurant");
    }

    public RestaurantException(String message) {
        super(message);
    }
}
