package com.srimaps.backend.controller;

import com.srimaps.backend.entity.Schedule;
import com.srimaps.backend.service.ScheduleService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping
    public List<Schedule> getSchedules(
            @RequestParam(required = false) String routeNumber,
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end
    ) {
