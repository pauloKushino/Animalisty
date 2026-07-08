package com.animalisty.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_anime_list", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "anime_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAnimeList {

    public enum Status {
        WATCHING,
        COMPLETED,
        PLAN_TO_WATCH,
        DROPPED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "anime_id", nullable = false)
    private Integer animeId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
