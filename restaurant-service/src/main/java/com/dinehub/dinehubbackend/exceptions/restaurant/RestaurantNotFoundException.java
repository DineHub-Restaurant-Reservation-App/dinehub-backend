package com.dinehub.dinehubbackend.exceptions.restaurant;

public class RestaurantNotFoundException extends RuntimeException{

    public RestaurantNotFoundException() {
        super("Restaurant not found!");
    }

    public RestaurantNotFoundException(String message) {
        super(message);
    }
}
