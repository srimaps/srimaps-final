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
}
