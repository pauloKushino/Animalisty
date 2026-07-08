package com.animalisty.repository;

import com.animalisty.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    Optional<Favorite> findByUserIdAndAnimeId(Long userId, Integer animeId);
    List<Favorite> findByUserId(Long userId);
    boolean existsByUserIdAndAnimeId(Long userId, Integer animeId);
    void deleteByUserIdAndAnimeId(Long userId, Integer animeId);
}
