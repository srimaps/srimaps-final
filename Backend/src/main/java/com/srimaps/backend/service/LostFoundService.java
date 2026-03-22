import com.srimaps.backend.entity.Route;
import com.srimaps.backend.repository.LostFoundRepository;
import com.srimaps.backend.repository.RouteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LostFoundService {

    private final LostFoundRepository lostFoundRepository;
    private final RouteRepository routeRepository;

        public LostFoundService(LostFoundRepository lostFoundRepository, RouteRepository routeRepository) {
        this.lostFoundRepository = lostFoundRepository;
        this.routeRepository = routeRepository;
    }




}
