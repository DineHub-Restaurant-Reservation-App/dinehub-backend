package com.dinehub.dinehubbackend.entities;

import jakarta.persistence.*;

@Entity
public class ReservationSettings {

    @Id
    @GeneratedValue
    private int id;

    @OneToOne
    @JoinColumn(name = "restaurant_id", referencedColumnName = "id")
    private Restaurant restaurant;

    @Column(nullable = false)
    private float slotInterval;
    @Column(nullable = false)
    private float bufferTime;
    @Column(nullable = false)
    private float tableCount;
    @Column(nullable = false)
    private float capacityPerTable;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public float getSlotInterval() {
        return slotInterval;
    }

    public void setSlotInterval(float slotInterval) {
        this.slotInterval = slotInterval;
    }

    public float getBufferTime() {
        return bufferTime;
    }

    public void setBufferTime(float bufferTime) {
        this.bufferTime = bufferTime;
    }

    public float getTableCount() {
        return tableCount;
    }

    public void setTableCount(float tableCount) {
        this.tableCount = tableCount;
    }

    public float getCapacityPerTable() {
        return capacityPerTable;
    }

    public void setCapacityPerTable(float capacityPerTable) {
        this.capacityPerTable = capacityPerTable;
    }

    @Override
    public String toString() {
        return "ReservationSettings{" +
                "id=" + id +
                ", restaurant=" + restaurant +
                ", slotInterval=" + slotInterval +
                ", bufferTime=" + bufferTime +
                ", tableCount=" + tableCount +
                ", capacityPerTable=" + capacityPerTable +
                '}';
    }
}
