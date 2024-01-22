package com.dinehub.dinehubbackend.services.impl;

import com.dinehub.dinehubbackend.dao.RestaurantDao;
import com.dinehub.dinehubbackend.entities.Restaurant;
import com.dinehub.dinehubbackend.exceptions.restaurant.DuplicateRestaurantException;
import com.dinehub.dinehubbackend.exceptions.restaurant.RestaurantNotFoundException;
import com.dinehub.dinehubbackend.services.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantServiceImpl implements RestaurantService {

    @Autowired
    private RestaurantDao restaurantDao;
    @Override
    public Restaurant createRestaurant(Restaurant restaurant) throws DuplicateRestaurantException{

        if(isRestaurantAlreadyExisting(restaurant)){
            throw new DuplicateRestaurantException();
        }

        return restaurantDao.save(restaurant);
    }

    public boolean isRestaurantAlreadyExisting(Restaurant restaurant){
        Restaurant savedRestaurant = restaurantDao.findByName(restaurant.getName());

        if(savedRestaurant!=null){
            return true;
        }

        return false;
    }

    @Override
    public Restaurant updateRestaurant(Restaurant restaurant) throws RestaurantNotFoundException{
        Restaurant savedRestaurant = restaurantDao.findById(restaurant.getRestaurantId())
                .orElseThrow(RestaurantNotFoundException::new);

        savedRestaurant.setName(restaurant.getName());
        savedRestaurant.setLogo(restaurant.getLogo());
        savedRestaurant.setBusinessHour(restaurant.getBusinessHour());
        savedRestaurant.setCuisine(restaurant.getCuisine());
        savedRestaurant.setRating(restaurant.getRating());
        savedRestaurant.setAbout(restaurant.getAbout());

        return restaurantDao.save(savedRestaurant);


    }

    @Override
    public boolean deleteRestaurant(String id) {

        if(restaurantDao.existsById(id)){
            restaurantDao.deleteById(id);
            return true;
        }

        return false;
    }

    @Override
    public List<Restaurant> getRestaurantByName(String name) throws RestaurantNotFoundException{
        List<Restaurant> savedRestaurants = restaurantDao.findByNameStartingWith(name)
                .orElseThrow(()->new RestaurantNotFoundException("No Restaurant with name like "+ name));

        return savedRestaurants;
    }

    @Override
    public Restaurant getRestaurantById(String id) throws RestaurantNotFoundException{

        Restaurant restaurant = restaurantDao.findById(id)
                .orElseThrow(()-> new RestaurantNotFoundException("Restaurant with id: " + id + " is not found!"));

        return restaurant;
    }

    @Override
    public List<Restaurant> getAllRestaurants() {
        return restaurantDao.findAll();
    }
}
