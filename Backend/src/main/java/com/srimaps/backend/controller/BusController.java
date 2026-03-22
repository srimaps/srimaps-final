package com.srimaps.backend.controller;

import com.srimaps.backend.entity.Bus;
import com.srimaps.backend.service.BusService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
public class BusController {

   private final BusService busService;

   public BusController(BusService busService) {
      this.busService = busService;
   }

    @GetMapping
    public List<Bus> getAllBuses() {
       return busService.getAllBuses();
   }

   @GetMapping("/{busId}")
   public Bus getBusById(@PathVariable Integer busId) {
      return busService.getBusById(busId);
   }

   @GetMapping("/search")
   public List<Bus> searchByRoute(@RequestParam String routeNumber) {
      return busService.searchByRouteNumber(routeNumber);
   }

   @GetMapping("/search-by-destination")
   public List<Bus> searchByDestination(
         @RequestParam String start,
         @RequestParam String end
   ) {
      return busService.searchByDestinations(start, end);
   }

    @GetMapping("/sharing")
    public List<Bus> getSharingBuses() {
       return busService.getCurrentlySharingBuses();
    }

   
        


}
