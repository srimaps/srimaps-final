import com.srimaps.backend.dto.LocationRequest;
import com.srimaps.backend.entity.Bus;
import com.srimaps.backend.entity.BusLocation;
import com.srimaps.backend.exception.ResourceNotFoundException;
import com.srimaps.backend.repository.BusLocationRepository;
import com.srimaps.backend.repository.BusRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class LocationService {
  private final BusLocationRepository busLocationRepository;
    private final BusRepository busRepository;

    public LocationService(BusLocationRepository busLocationRepository, BusRepository busRepository) {
        this.busLocationRepository = busLocationRepository;
        this.busRepository = busRepository;
    }
   public BusLocation addLocation(Integer busId, LocationRequest request) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + busId));

        BusLocation location = new BusLocation();
        location.setBus(bus);
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setSpeed(request.getSpeed() != null ? request.getSpeed() : 0.0);
        location.setRecordedAt(LocalDateTime.now());

        return busLocationRepository.save(location);
    }
  public BusLocation getLatestLocation(Integer busId) {
        return busLocationRepository.findTopByBus_BusIdOrderByRecordedAtDesc(busId)
                .orElseThrow(() -> new ResourceNotFoundException("No location found for bus id: " + busId));
    }
  public List<BusLocation> getLocationHistory(Integer busId) {
        return busLocationRepository.findByBus_BusIdOrderByRecordedAtDesc(busId);
    }

    public List<BusLocation> getLatestLocationsForSharingBuses() {
        List<BusLocation> allLocations = busLocationRepository.findAllByOrderByRecordedAtDesc();
        Map<Integer, BusLocation> latestPerBus = new LinkedHashMap<>();
    or (BusLocation location : allLocations) {
            if (location.getBus() != null
                    && Boolean.TRUE.equals(location.getBus().getIsSharingLocation())
                    && !latestPerBus.containsKey(location.getBus().getBusId())) {
                latestPerBus.put(location.getBus().getBusId(), location);
            }
        }

        return new ArrayList<>(latestPerBus.values());
    }  
}
