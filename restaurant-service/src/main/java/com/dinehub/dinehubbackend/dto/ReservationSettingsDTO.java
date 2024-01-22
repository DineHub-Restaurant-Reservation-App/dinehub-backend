package com.dinehub.dinehubbackend.dto;

public class ReservationSettingsDTO {
    private int id;

    private RestaurantDTO restaurant;

    private float slotInterval;
    private float bufferTime;
    private float tableCount;
    private float capacityPerTable;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public RestaurantDTO getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(RestaurantDTO restaurant) {
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
}
