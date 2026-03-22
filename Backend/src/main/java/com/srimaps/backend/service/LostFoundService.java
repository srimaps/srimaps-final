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
    public List<LostFoundItem> getAllItems() {
        return lostFoundRepository.findAllByOrderByReportedAtDesc();
    }


    public List<LostFoundItem> getItemsByType(String itemType) {
        return lostFoundRepository.findByItemTypeOrderByReportedAtDesc(itemType.toUpperCase());
    }

    public List<LostFoundItem> getItemsByStatus(String status) {
        return lostFoundRepository.findByStatusOrderByReportedAtDesc(status.toUpperCase());
    }

    public List<LostFoundItem> getItemsByRoute(String routeNumber) {
        return lostFoundRepository.findByRoute_RouteNumberOrderByReportedAtDesc(routeNumber);
    }

    public List<LostFoundItem> getItemsByTypeAndRoute(String itemType, String routeNumber) {
        return lostFoundRepository.findByItemTypeAndRoute_RouteNumberOrderByReportedAtDesc(
                itemType.toUpperCase(),
                routeNumber
        );
    }


}
