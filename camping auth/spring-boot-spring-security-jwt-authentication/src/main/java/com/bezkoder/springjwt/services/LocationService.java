package com.bezkoder.springjwt.services;

import com.bezkoder.springjwt.dto.LocationDTO;
import com.bezkoder.springjwt.models.Location;
import com.bezkoder.springjwt.repository.LocationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    public Location createLocation(LocationDTO locationDTO) {
        Location location = new Location();
        location.setName(locationDTO.getName());
        location.setDescription(locationDTO.getDescription());
        location.setLatitude(locationDTO.getLatitude());
        location.setLongitude(locationDTO.getLongitude());
        return locationRepository.save(location);
    }

    public Optional<Location> getLocation(Long id) {
        return locationRepository.findById(id);
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Location updateLocation(Long id, LocationDTO locationDTO) {
        Optional<Location> locationOpt = locationRepository.findById(id);
        if (locationOpt.isPresent()) {
            Location location = locationOpt.get();
            location.setName(locationDTO.getName());
            location.setDescription(locationDTO.getDescription());
            location.setLatitude(locationDTO.getLatitude());
            location.setLongitude(locationDTO.getLongitude());
            return locationRepository.save(location);
        }
        return null;
    }

    public void deleteLocation(Long id) {
        locationRepository.deleteById(id);
    }
}