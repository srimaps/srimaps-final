package com.srimaps.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "lost_found_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LostFoundItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Integer itemId;

    @Column(name = "item_type", nullable = false)
    private String itemType;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "contact_info", nullable = false)
    private String contactInfo;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    @Column(name = "reported_at")
    private LocalDateTime reportedAt = LocalDateTime.now();

    @Column(name = "status")
    private String status = "OPEN";
}
