package com.dinehub.dinehubbackend.controllers;

import com.dinehub.dinehubbackend.dto.RestaurantDTO;
import com.dinehub.dinehubbackend.entities.Restaurant;
import com.dinehub.dinehubbackend.services.AuthService;
import com.dinehub.dinehubbackend.services.RestaurantService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "restaurant_app/v1")
public class RestaurantController {

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private RestaurantService restaurantService;
    @Autowired
    private AuthService authService;
    @GetMapping(value = "/restaurant")
    public ResponseEntity getRestaurantByName(@RequestParam(name = "restaurantName") String name){

        List<Restaurant> restaurants = restaurantService.getRestaurantByName(name);

        List<RestaurantDTO> restaurantDTOList = new ArrayList<>();
        for(Restaurant restaurant : restaurants){
            restaurantDTOList.add(modelMapper.map(restaurant, RestaurantDTO.class));
        }

        return new ResponseEntity<>(restaurantDTOList, HttpStatus.OK);
    }
    @GetMapping(value = "/restaurant/{id}")
    public ResponseEntity getRestaurantById(@PathVariable("id") String id){

        System.out.println(id);

        Restaurant restaurant = restaurantService.getRestaurantById(id);


        return new ResponseEntity<>(modelMapper.map(restaurant,RestaurantDTO.class), HttpStatus.OK);
    }
    @PutMapping(value = "/restaurant",consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity updateRestaurantById(@RequestBody RestaurantDTO restaurantDTO){

        Restaurant restaurant = modelMapper.map(restaurantDTO,Restaurant.class);

        Restaurant updatedRestaurant = restaurantService.updateRestaurant(restaurant);

        return new ResponseEntity<>(modelMapper.map(updatedRestaurant,RestaurantDTO.class),HttpStatus.OK);

    }
    @DeleteMapping("/restaurant/{id}")
    public ResponseEntity deleteRestaurant(@PathVariable(name = "id") String id){

        boolean deleteRestaurant = restaurantService.deleteRestaurant(id);

        String responseMsg = "Is Restaurant Delete: " + deleteRestaurant;
        return new ResponseEntity<>(responseMsg, HttpStatus.OK);
    }

}
