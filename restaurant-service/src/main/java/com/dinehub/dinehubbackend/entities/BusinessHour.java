package com.dinehub.dinehubbackend.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class BusinessHour {

    @Id
    @GeneratedValue
    private int id;

    @Column(nullable = false)
    private float mondayStartTime;

    @Column(nullable = false)
    private float mondayEndTime;
    @Column(nullable = false)
    private float tuesdayStartTime;
    @Column(nullable = false)
    private float tuesdayEndTime;

    @Column(nullable = false)
    private float wednesdayStartTime;
    @Column(nullable = false)
    private float wednesdayEndTime;

    @Column(nullable = false)
    private float thursdayStartTime;

    @Column(nullable = false)
    private float thursdayEndTime;
    @Column(nullable = false)
    private float fridayStartTime;
    @Column(nullable = false)
    private float fridayEndTime;
    @Column(nullable = false)
    private float saturdayStartTime;
    @Column(nullable = false)
    private float saturdayEndTime;
    @Column(nullable = false)
    private float sundayStartTime;
    @Column(nullable = false)
    private float sundayEndTime;


    public int getId() {
        return id;
    }

    public float getMondayStartTime() {
        return mondayStartTime;
    }

    public void setMondayStartTime(float mondayStartTime) {
        this.mondayStartTime = mondayStartTime;
    }

    public float getMondayEndTime() {
        return mondayEndTime;
    }

    public void setMondayEndTime(float mondayEndTime) {
        this.mondayEndTime = mondayEndTime;
    }

    public float getTuesdayStartTime() {
        return tuesdayStartTime;
    }

    public void setTuesdayStartTime(float tuesdayStartTime) {
        this.tuesdayStartTime = tuesdayStartTime;
    }

    public float getTuesdayEndTime() {
        return tuesdayEndTime;
    }

    public void setTuesdayEndTime(float tuesdayEndTime) {
        this.tuesdayEndTime = tuesdayEndTime;
    }

    public float getWednesdayStartTime() {
        return wednesdayStartTime;
    }

    public void setWednesdayStartTime(float wednesdayStartTime) {
        this.wednesdayStartTime = wednesdayStartTime;
    }

    public float getWednesdayEndTime() {
        return wednesdayEndTime;
    }

    public void setWednesdayEndTime(float wednesdayEndTime) {
        this.wednesdayEndTime = wednesdayEndTime;
    }

    public float getThursdayStartTime() {
        return thursdayStartTime;
    }

    public void setThursdayStartTime(float thursdayStartTime) {
        this.thursdayStartTime = thursdayStartTime;
    }

    public float getThursdayEndTime() {
        return thursdayEndTime;
    }

    public void setThursdayEndTime(float thursdayEndTime) {
        this.thursdayEndTime = thursdayEndTime;
    }

    public float getFridayStartTime() {
        return fridayStartTime;
    }

    public void setFridayStartTime(float fridayStartTime) {
        this.fridayStartTime = fridayStartTime;
    }

    public float getFridayEndTime() {
        return fridayEndTime;
    }

    public void setFridayEndTime(float fridayEndTime) {
        this.fridayEndTime = fridayEndTime;
    }

    public float getSaturdayStartTime() {
        return saturdayStartTime;
    }

    public void setSaturdayStartTime(float saturdayStartTime) {
        this.saturdayStartTime = saturdayStartTime;
    }

    public float getSaturdayEndTime() {
        return saturdayEndTime;
    }

    public void setSaturdayEndTime(float saturdayEndTime) {
        this.saturdayEndTime = saturdayEndTime;
    }

    public float getSundayStartTime() {
        return sundayStartTime;
    }

    public void setSundayStartTime(float sundayStartTime) {
        this.sundayStartTime = sundayStartTime;
    }

    public float getSundayEndTime() {
        return sundayEndTime;
    }

    public void setSundayEndTime(float sundayEndTime) {
        this.sundayEndTime = sundayEndTime;
    }


    @Override
    public String toString() {
        return "BusinessHour{" +
                "id=" + id +
                ", mondayStartTime=" + mondayStartTime +
                ", mondayEndTime=" + mondayEndTime +
                ", tuesdayStartTime=" + tuesdayStartTime +
                ", tuesdayEndTime=" + tuesdayEndTime +
                ", wednesdayStartTime=" + wednesdayStartTime +
                ", wednesdayEndTime=" + wednesdayEndTime +
                ", thursdayStartTime=" + thursdayStartTime +
                ", thursdayEndTime=" + thursdayEndTime +
                ", fridayStartTime=" + fridayStartTime +
                ", fridayEndTime=" + fridayEndTime +
                ", saturdayStartTime=" + saturdayStartTime +
                ", saturdayEndTime=" + saturdayEndTime +
                ", sundayStartTime=" + sundayStartTime +
                ", sundayEndTime=" + sundayEndTime +
                '}';
    }
}
