package com.dinehub.dinehubbackend.dao;

import com.dinehub.dinehubbackend.entities.ReservationSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationSettingsDao extends JpaRepository<ReservationSettings,Integer> {
}
