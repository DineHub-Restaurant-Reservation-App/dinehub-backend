package com.dinehub.dinehubbackend.dao;

import com.dinehub.dinehubbackend.entities.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemDao extends JpaRepository<MenuItem,Integer> {
}
