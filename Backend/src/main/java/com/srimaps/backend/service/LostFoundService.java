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
    
    public LostFoundItem createItem(LostFoundRequest request) {
        String normalizedType = request.getItemType().trim().toUpperCase();

        if (!normalizedType.equals("LOST") && !normalizedType.equals("FOUND")) {
            throw new IllegalArgumentException("Item type must be LOST or FOUND");
        }

        LostFoundItem item = new LostFoundItem();
        item.setItemType(normalizedType);
        item.setItemName(request.getItemName().trim());
        item.setDescription(request.getDescription().trim());
        item.setContactInfo(request.getContactInfo().trim());
        item.setReportedAt(LocalDateTime.now());
        item.setStatus("OPEN");

        if (request.getRouteId() != null) {
            Route route = routeRepository.findById(request.getRouteId())
                    .orElseThrow(() -> new IllegalArgumentException("Route not found"));
            item.setRoute(route);
        }
        return lostFoundRepository.save(item);
    }


}
