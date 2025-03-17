package com.bezkoder.springjwt.controllers;
import com.bezkoder.springjwt.dto.ReservationRequest;
import com.bezkoder.springjwt.models.Product;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.repository.ProductRepository;
import com.bezkoder.springjwt.repository.UserRepository;
import com.bezkoder.springjwt.services.ProductService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("photo") MultipartFile photo) throws Exception {

        byte[] photoBytes = photo.getBytes();  // Convert photo to byte array

        // Pass null for user if user is optional
        Product product = productService.addProduct(name, description, price, photoBytes);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        productRepository.delete(product);
        return ResponseEntity.ok().build();
    }



    @GetMapping("/all/{userId}")
    public ResponseEntity<List<Product>> getAllProducts(@PathVariable Long userId) {
        List<Product> products = productRepository.findAll();

        for (Product product : products) {
            boolean isReserved = product.getReservedByUsers().stream()
                    .anyMatch(user -> user.getId().equals(userId));
            product.setReservedByCurrentUser(isReserved);
        }

        return new ResponseEntity<>(products, HttpStatus.OK);
    }




    @PostMapping("/reserve")
    @Transactional
    public ResponseEntity<Product> reserveProduct(@RequestBody ReservationRequest request) {
        Product product = productRepository.findByIdWithUsers(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!product.getReservedByUsers().contains(user)) {
            product.getReservedByUsers().add(user);
            productRepository.save(product);
        }

        // Ensure the reservation status is dynamically set
        product.setReservedByCurrentUser(product.isReservedByCurrentUser(request.getUserId()));

        return new ResponseEntity<>(product, HttpStatus.OK);
    }



    @PostMapping("/cancel")
    public ResponseEntity<Product> cancelReservation(@RequestBody ReservationRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (product.getReservedByUsers().contains(user)) {
            product.getReservedByUsers().remove(user);
            productRepository.save(product);
        }

        // Fetch the updated product from the database to ensure the latest state
        product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        boolean isReserved = product.getReservedByUsers().contains(user);
        product.setReservedByCurrentUser(isReserved);

        return new ResponseEntity<>(product, HttpStatus.OK);
    }



}
