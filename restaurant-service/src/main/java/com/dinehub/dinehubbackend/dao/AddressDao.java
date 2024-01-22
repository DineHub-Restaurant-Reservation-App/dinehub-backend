package com.dinehub.dinehubbackend.dao;

import com.dinehub.dinehubbackend.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressDao extends JpaRepository<Address,Integer> {
}
