package com.bezkoder.springjwt.dto;

public class ReservationRequest {
    private Long productId;
    private Long userId;

    // Default constructor (REQUIRED for Jackson to deserialize JSON)
    public ReservationRequest() {}

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
