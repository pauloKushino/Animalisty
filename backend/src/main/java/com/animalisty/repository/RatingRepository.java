package com.animalisty.repository;

import com.animalisty.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserIdAndAnimeId(Long userId, Integer animeId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.animeId = :animeId")
    Double findAverageScoreByAnimeId(Integer animeId);

    Long countByAnimeId(Integer animeId);
}
