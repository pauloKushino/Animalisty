package com.animalisty.service;

import com.animalisty.entity.Comment;
import com.animalisty.entity.Favorite;
import com.animalisty.entity.Rating;
import com.animalisty.entity.User;
import com.animalisty.repository.CommentRepository;
import com.animalisty.repository.FavoriteRepository;
import com.animalisty.repository.RatingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EngagementService {

    private final RatingRepository ratingRepository;
    private final FavoriteRepository favoriteRepository;
    private final CommentRepository commentRepository;

    public EngagementService(RatingRepository ratingRepository,
                             FavoriteRepository favoriteRepository,
                             CommentRepository commentRepository) {
        this.ratingRepository = ratingRepository;
        this.favoriteRepository = favoriteRepository;
        this.commentRepository = commentRepository;
    }

    // ── Ratings ──

    @Transactional
    public Rating submitRating(User user, Integer animeId, Integer score) {
        Rating rating = ratingRepository.findByUserIdAndAnimeId(user.getId(), animeId)
                .orElse(Rating.builder()
                        .user(user)
                        .animeId(animeId)
                        .build());
        rating.setScore(score);
        return ratingRepository.save(rating);
    }

    public Map<String, Object> getRatingInfo(User user, Integer animeId) {
        Double average = ratingRepository.findAverageScoreByAnimeId(animeId);
        Map<String, Object> result = new HashMap<>();
        result.put("average", average != null ? Math.round(average * 100.0) / 100.0 : null);
        result.put("count", ratingRepository.countByAnimeId(animeId));

        if (user != null) {
            ratingRepository.findByUserIdAndAnimeId(user.getId(), animeId)
                    .ifPresent(r -> result.put("userScore", r.getScore()));
        }

        return result;
    }

    // ── Favorites ──

    @Transactional
    public boolean toggleFavorite(User user, Integer animeId) {
        var existing = favoriteRepository.findByUserIdAndAnimeId(user.getId(), animeId);
        if (existing.isPresent()) {
            favoriteRepository.deleteByUserIdAndAnimeId(user.getId(), animeId);
            return false; // removed
        } else {
            favoriteRepository.save(Favorite.builder()
                    .user(user)
                    .animeId(animeId)
                    .build());
            return true; // added
        }
    }

    public List<Favorite> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    public boolean isFavorite(Long userId, Integer animeId) {
        return favoriteRepository.existsByUserIdAndAnimeId(userId, animeId);
    }

    // ── Comments ──

    public List<Comment> getComments(Integer animeId) {
        return commentRepository.findByAnimeIdOrderByCreatedAtDesc(animeId);
    }

    @Transactional
    public Comment createComment(User user, Integer animeId, String content) {
        Comment comment = Comment.builder()
                .user(user)
                .animeId(animeId)
                .content(content)
                .build();
        return commentRepository.save(comment);
    }

    @Transactional
    public Comment updateComment(User user, Long commentId, String content) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comentário não encontrado"));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Você só pode editar seus próprios comentários");
        }

        comment.setContent(content);
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(User user, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comentário não encontrado"));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Você só pode excluir seus próprios comentários");
        }

        commentRepository.delete(comment);
    }
}
