package com.dinehub.dinehubbackend.exceptions.user;

public class DuplicateUserException extends RuntimeException{
    public DuplicateUserException() {
        super("User already exists");
    }

    public DuplicateUserException(String message) {
        super(message);
    }
}
