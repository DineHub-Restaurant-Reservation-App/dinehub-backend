package com.dinehub.dinehubbackend.services;

import com.dinehub.dinehubbackend.entities.Restaurant;
import com.dinehub.dinehubbackend.exceptions.restaurant.DuplicateRestaurantException;
import com.dinehub.dinehubbackend.exceptions.restaurant.RestaurantNotFoundException;

import java.util.List;

public interface RestaurantService {

    public Restaurant createRestaurant(Restaurant restaurant) throws DuplicateRestaurantException;

    boolean isRestaurantAlreadyExisting(String name);

    public Restaurant updateRestaurant(Restaurant restaurant) throws RestaurantNotFoundException;

    public boolean deleteRestaurant(String id);

    public List<Restaurant> getRestaurantByName(String name) throws RestaurantNotFoundException;

    public Restaurant getRestaurantById(String name) throws RestaurantNotFoundException;

    public List<Restaurant> getAllRestaurants();

}
