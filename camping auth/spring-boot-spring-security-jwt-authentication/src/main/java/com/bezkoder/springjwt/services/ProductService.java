package com.bezkoder.springjwt.services;

import com.bezkoder.springjwt.models.Product;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.repository.ProductRepository;
import com.bezkoder.springjwt.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Method to add a new product
    @Transactional
    public Product addProduct(String name, String description, double price, byte[] photo) {
        // Product is created without a user
        Product product = new Product(name, description, price, photo);

        // Save product without user association
        return productRepository.save(product);
    }


    // Method to reserve a product for a user
    @Transactional
    public Product reserveProduct(Long productId, Long userId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Add product to the user's reserved list
        user.getReservedProducts().add(product);
        userRepository.save(user);

        // Optionally, you can also add the user to the product's reservedByUsers list
        product.getReservedByUsers().add(user);
        productRepository.save(product);

        return product;
    }
}
