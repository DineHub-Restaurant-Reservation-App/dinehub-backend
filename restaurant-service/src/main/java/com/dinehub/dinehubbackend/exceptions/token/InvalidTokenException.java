package com.dinehub.dinehubbackend.exceptions.token;

public class InvalidTokenException extends RuntimeException{
    public InvalidTokenException() {
        super("Invalid token!");
    }

    public InvalidTokenException(String message) {
        super(message);
    }
}
