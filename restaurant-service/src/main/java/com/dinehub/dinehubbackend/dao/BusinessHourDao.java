package com.dinehub.dinehubbackend.dao;

import com.dinehub.dinehubbackend.entities.BusinessHour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessHourDao extends JpaRepository<BusinessHour,Integer> {
}
