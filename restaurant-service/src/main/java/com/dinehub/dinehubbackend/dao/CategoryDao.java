package com.dinehub.dinehubbackend.dao;

import com.dinehub.dinehubbackend.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryDao extends JpaRepository<Category,Integer> {
}
