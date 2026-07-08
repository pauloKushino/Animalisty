package com.animalisty.repository;

import com.animalisty.entity.UserAnimeList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAnimeListRepository extends JpaRepository<UserAnimeList, Long> {
    List<UserAnimeList> findByUserId(Long userId);
    List<UserAnimeList> findByUserIdAndStatus(Long userId, UserAnimeList.Status status);
    Optional<UserAnimeList> findByUserIdAndAnimeId(Long userId, Integer animeId);
    void deleteByUserIdAndAnimeId(Long userId, Integer animeId);
}
