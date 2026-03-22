package com.srimaps.backend.service;

import com.srimaps.backend.entity.Schedule;
import com.srimaps.backend.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAllByOrderByDepartureTimeAsc();
    }
