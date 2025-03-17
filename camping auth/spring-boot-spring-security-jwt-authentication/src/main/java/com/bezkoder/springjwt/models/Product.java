package com.bezkoder.springjwt.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double price;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] photo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user; // The owner of the product (if any)

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_reserved_products",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> reservedByUsers = new HashSet<>();

    @Transient
    @JsonProperty("reservedByCurrentUser") // Ensure this field appears in the JSON response
    private boolean reservedByCurrentUser; // Not stored in DB, only used for frontend response

    // Constructors
    public Product() {
    }

    public Product(String name, String description, double price, byte[] photo) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.photo = photo;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<User> getReservedByUsers() {
        return reservedByUsers;
    }

    public void setReservedByUsers(Set<User> reservedByUsers) {
        this.reservedByUsers = reservedByUsers;
    }

    public boolean isReservedByCurrentUser(Long userId) {
        if (userId == null) return false;
        return this.reservedByUsers.stream().anyMatch(user -> user.getId().equals(userId));
    }

    public void setReservedByCurrentUser(boolean reservedByCurrentUser) {
        this.reservedByCurrentUser = reservedByCurrentUser;
    }
}
