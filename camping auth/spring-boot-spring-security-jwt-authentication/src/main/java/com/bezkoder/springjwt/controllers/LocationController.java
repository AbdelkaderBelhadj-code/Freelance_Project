package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.dto.LocationDTO;
import com.bezkoder.springjwt.models.Location;
import com.bezkoder.springjwt.services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @PostMapping
    public ResponseEntity<Location> createLocation(@RequestBody LocationDTO locationDTO) {
        Location location = locationService.createLocation(locationDTO);
        return ResponseEntity.ok(location);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocation(@PathVariable Long id) {
        return locationService.getLocation(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Location>> getAllLocations() {
        List<Location> locations = locationService.getAllLocations();
        return ResponseEntity.ok(locations);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(@PathVariable Long id, @RequestBody LocationDTO locationDTO) {
        Location location = locationService.updateLocation(id, locationDTO);
        if (location != null) {
            return ResponseEntity.ok(location);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.ok().build();
    }
}