package com.dinehub.dinehubbackend.services;

import com.dinehub.dinehubbackend.entities.Category;
import com.dinehub.dinehubbackend.entities.MenuItem;

public interface MenuService {

    public Category addCategory(Category category);
    public Category updateCategory(Category category);
    public boolean deleteCategory(Category category);
    public MenuItem addMenuItem(MenuItem menuItem);
    public MenuItem udpateMenuItem(MenuItem menuItem);
    public boolean deleteMenuItem(MenuItem menuItem);

    public Category getRestaurantMenu(int restaurantId);

}
