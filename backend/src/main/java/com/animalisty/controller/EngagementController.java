package com.animalisty.controller;

import com.animalisty.dto.CommentRequest;
import com.animalisty.dto.RatingRequest;
import com.animalisty.entity.Comment;
import com.animalisty.entity.Favorite;
import com.animalisty.entity.Rating;
import com.animalisty.security.SecurityUtil;
import com.animalisty.service.EngagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class EngagementController {

    private final EngagementService engagementService;
    private final SecurityUtil securityUtil;

    public EngagementController(EngagementService engagementService, SecurityUtil securityUtil) {
        this.engagementService = engagementService;
        this.securityUtil = securityUtil;
    }

    // ── Ratings ──

    @PostMapping("/api/animes/{id}/rating")
    public ResponseEntity<Map<String, Object>> submitRating(
            @PathVariable Integer id,
            @Valid @RequestBody RatingRequest request) {
        var user = securityUtil.getCurrentUser();
        Rating rating = engagementService.submitRating(user, id, request.getScore());

        Map<String, Object> response = new HashMap<>();
        response.put("id", rating.getId());
        response.put("score", rating.getScore());
        response.put("animeId", rating.getAnimeId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/animes/{id}/rating")
    public ResponseEntity<Map<String, Object>> getRating(@PathVariable Integer id) {
        var user = securityUtil.getCurrentUserOrNull();
        Map<String, Object> ratingInfo = engagementService.getRatingInfo(user, id);
        return ResponseEntity.ok(ratingInfo);
    }

    // ── Favorites ──

    @PostMapping("/api/animes/{id}/favorite")
    public ResponseEntity<Map<String, Object>> toggleFavorite(@PathVariable Integer id) {
        var user = securityUtil.getCurrentUser();
        boolean isFavorite = engagementService.toggleFavorite(user, id);

        Map<String, Object> response = new HashMap<>();
        response.put("favorite", isFavorite);
        response.put("animeId", id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/user/favorites")
    public ResponseEntity<List<Favorite>> getUserFavorites() {
        var user = securityUtil.getCurrentUser();
        List<Favorite> favorites = engagementService.getUserFavorites(user.getId());
        return ResponseEntity.ok(favorites);
    }

    // ── Comments ──

    @GetMapping("/api/animes/{id}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Integer id) {
        List<Comment> comments = engagementService.getComments(id);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/api/animes/{id}/comments")
    public ResponseEntity<Comment> createComment(
            @PathVariable Integer id,
            @Valid @RequestBody CommentRequest request) {
        var user = securityUtil.getCurrentUser();
        Comment comment = engagementService.createComment(user, id, request.getContent());
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @PutMapping("/api/comments/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request) {
        var user = securityUtil.getCurrentUser();
        Comment comment = engagementService.updateComment(user, commentId, request.getContent());
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        var user = securityUtil.getCurrentUser();
        engagementService.deleteComment(user, commentId);
        return ResponseEntity.noContent().build();
    }
}
