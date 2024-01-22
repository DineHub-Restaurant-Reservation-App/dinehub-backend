package com.dinehub.dinehubbackend.converters;

import com.dinehub.dinehubbackend.dto.RestaurantDTO;
import com.dinehub.dinehubbackend.entities.Restaurant;

public class RestaurantConverter {
    public static RestaurantDTO convertToDTO(Restaurant restaurant){

        RestaurantDTO restaurantDTO = new RestaurantDTO();
//
//        restaurantDTO.setRestaurantId(restaurant.getRestaurantId());
//        restaurantDTO.setName(restaurant.getName());
//        restaurantDTO.setAddress(restaurant.getAddress());
//        restaurantDTO.setBannerImage(restaurant.getBannerImage());
//        restaurantDTO.setLogo(restaurant.getLogo());
////        restaurantDTO.setBusinessHour(restaurant.getBusinessHour());
//        restaurantDTO.setCuisine(restaurant.getCuisine());
//        restaurantDTO.setRating(restaurant.getRating());
//        restaurantDTO.setAbout(restaurant.getAbout());

        return restaurantDTO;
    }


}
