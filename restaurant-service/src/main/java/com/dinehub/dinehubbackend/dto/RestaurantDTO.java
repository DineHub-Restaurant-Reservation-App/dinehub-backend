package com.dinehub.dinehubbackend.dto;

public class RestaurantDTO {
    private String restaurantId;

    private String name;

    private AddressDTO address;

    private String bannerImage;

    private String logo;

    private BusinessHourDTO businessHour;

    private String cuisine;

    private double rating;
    private String about;

    public String getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(String restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AddressDTO getAddress() {
        return address;
    }

    public void setAddress(AddressDTO address) {
        this.address = address;
    }

    public String getBannerImage() {
        return bannerImage;
    }

    public void setBannerImage(String bannerImage) {
        this.bannerImage = bannerImage;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public BusinessHourDTO getBusinessHour() {
        return businessHour;
    }

    public void setBusinessHour(BusinessHourDTO businessHour) {
        this.businessHour = businessHour;
    }

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }
}
