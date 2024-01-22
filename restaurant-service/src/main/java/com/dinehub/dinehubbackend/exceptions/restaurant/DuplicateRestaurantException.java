package com.dinehub.dinehubbackend.exceptions.restaurant;

public class DuplicateRestaurantException extends RuntimeException{
    public DuplicateRestaurantException() {
        super("Restaurant already exists. Please enter a different restaurant name!");
    }

    public DuplicateRestaurantException(String message) {
        super(message);
    }
}
