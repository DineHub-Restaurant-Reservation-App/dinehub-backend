package com.dinehub.dinehubbackend.dao;

import com.dinehub.dinehubbackend.entities.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RestaurantDao extends JpaRepository<Restaurant,String> {

    public Restaurant findByName(String name);
    public Restaurant findByNameOrEmail(String name,String email);

    public Restaurant findByEmail(String email);

    public Optional<List<Restaurant>> findByNameStartingWith(String name);
}
