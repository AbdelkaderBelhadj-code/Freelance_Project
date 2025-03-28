package com.bezkoder.springjwt.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.bezkoder.springjwt.models.ERole;
import com.bezkoder.springjwt.models.Role;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.payload.request.LoginRequest;
import com.bezkoder.springjwt.payload.request.SignupRequest;
import com.bezkoder.springjwt.payload.response.JwtResponse;
import com.bezkoder.springjwt.payload.response.MessageResponse;
import com.bezkoder.springjwt.repository.RoleRepository;
import com.bezkoder.springjwt.repository.UserRepository;
import com.bezkoder.springjwt.security.jwt.JwtUtils;
import com.bezkoder.springjwt.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt, 
                         userDetails.getId(), 
                         userDetails.getUsername(), 
                         userDetails.getEmail(), 
                         roles));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(),
            signUpRequest.getEmail(),
            encoder.encode(signUpRequest.getPassword()));

    Set<Role> roles = new HashSet<>();

    // Assign the "Participant" role by default
    Role defaultRole = roleRepository.findByName(ERole.Participant)
            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
    roles.add(defaultRole);

    // Check if other roles are specified
    if (signUpRequest.getRole() != null) {
      signUpRequest.getRole().forEach(role -> {
        if (role.equalsIgnoreCase("admin")) {
          Role adminRole = roleRepository.findByName(ERole.Organisateur)
                  .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(adminRole);
        }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }
  @PutMapping("/update")
  public ResponseEntity<?> updateUser(@RequestParam Long userId, @Valid @RequestBody SignupRequest updateRequest) {
    // Check if the user exists
    User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Error: User not found."));

    // Update user details
    user.setUsername(updateRequest.getUsername());
    user.setEmail(updateRequest.getEmail());

    if (updateRequest.getPassword() != null) {
      user.setPassword(encoder.encode(updateRequest.getPassword()));
    }

    // Update roles
    Set<Role> roles = new HashSet<>();

    // Assign the "Participant" role by default
    Role defaultRole = roleRepository.findByName(ERole.Participant)
            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
    roles.add(defaultRole);

    if (updateRequest.getRole() != null) {
      updateRequest.getRole().forEach(role -> {
        if (role.equalsIgnoreCase("admin")) {
          Role adminRole = roleRepository.findByName(ERole.Organisateur)
                  .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(adminRole);
        }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User profile updated successfully!"));
  }

  @GetMapping("/getUserIdByUsername/{username}")
  public ResponseEntity<?> getUserIdByUsername(@PathVariable String username) {
    // Find the user by username
    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Error: User not found with username: " + username));

    // Return the user ID
    return ResponseEntity.ok(user.getId());
  }
}
