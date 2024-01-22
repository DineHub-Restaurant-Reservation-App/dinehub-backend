package com.dinehub.dinehubbackend.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Restaurant {

    @Id
    @Column(name = "id")
    private String restaurantId;

    @Column(length = 100,nullable = false,unique = true)
    private String name;

    @Column(nullable = false,unique = true)
    private String email;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", referencedColumnName = "id",nullable = true)
    @JsonIgnore
    private Address address;

    private String bannerImage = "";

    private String logo = "";

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "business_hour_id", referencedColumnName = "id",nullable = true)
    @JsonIgnore
    private BusinessHour businessHour;

    private String cuisine = "";

    private double rating = 0.0;

    private String about = "";

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
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

    public BusinessHour getBusinessHour() {
        return businessHour;
    }

    public void setBusinessHour(BusinessHour businessHour) {
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

    @Override
    public String toString() {
        return "Restaurant{" +
                "restaurantId=" + restaurantId +
                ", name='" + name + '\'' +
                ", addressId=" + address +  // Avoid circular reference
                ", bannerImage='" + bannerImage + '\'' +
                ", logo='" + logo + '\'' +
                ", businessHour=" + businessHour +  // Avoid circular reference
                ", cuisine='" + cuisine + '\'' +
                ", rating=" + rating +
                ", about='" + about + '\'' +
                '}';
    }
}
