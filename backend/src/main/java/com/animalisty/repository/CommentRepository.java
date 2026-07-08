package com.animalisty.repository;

import com.animalisty.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByAnimeIdOrderByCreatedAtDesc(Integer animeId);
    void deleteByIdAndUserId(Long id, Long userId);
}
