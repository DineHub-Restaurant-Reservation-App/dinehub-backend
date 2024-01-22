package com.dinehub.dinehubbackend.dto;

import com.dinehub.dinehubbackend.entities.MenuItem;
import com.dinehub.dinehubbackend.entities.Restaurant;
import java.util.Set;

public class CategoryDTO {
    private int id;
    private RestaurantDTO restaurantId;
    private String name;
    private String description;
    private Set<MenuItemDTO> menuItems;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public RestaurantDTO getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(RestaurantDTO restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<MenuItemDTO> getMenuItems() {
        return menuItems;
    }

    public void setMenuItems(Set<MenuItemDTO> menuItems) {
        this.menuItems = menuItems;
    }
}
