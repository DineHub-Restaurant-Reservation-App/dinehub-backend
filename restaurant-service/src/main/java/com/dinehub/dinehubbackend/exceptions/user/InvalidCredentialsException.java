package com.dinehub.dinehubbackend.exceptions.user;

public class InvalidCredentialsException extends RuntimeException{

    public InvalidCredentialsException() {
        super("Error occurred while authenticating!");
    }

    public InvalidCredentialsException(String message) {
        super(message);
    }
}
