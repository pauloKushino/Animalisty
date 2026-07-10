package com.animalisty.controller;

import com.animalisty.dto.UserListRequest;
import com.animalisty.entity.User;
import com.animalisty.entity.UserAnimeList;
import com.animalisty.repository.UserAnimeListRepository;
import com.animalisty.repository.UserRepository;
import com.animalisty.security.SecurityUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final SecurityUtil securityUtil;
    private final UserRepository userRepository;
    private final UserAnimeListRepository userAnimeListRepository;

    public UserController(SecurityUtil securityUtil,
                          UserRepository userRepository,
                          UserAnimeListRepository userAnimeListRepository) {
        this.securityUtil = securityUtil;
        this.userRepository = userRepository;
        this.userAnimeListRepository = userAnimeListRepository;
    }

    // ── Profile ──

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile() {
        User user = securityUtil.getCurrentUser();

        List<UserAnimeList> fullList = userAnimeListRepository.findByUserId(user.getId());

        long watching = fullList.stream().filter(l -> l.getStatus() == UserAnimeList.Status.WATCHING).count();
        long completed = fullList.stream().filter(l -> l.getStatus() == UserAnimeList.Status.COMPLETED).count();
        long planToWatch = fullList.stream().filter(l -> l.getStatus() == UserAnimeList.Status.PLAN_TO_WATCH).count();
        long dropped = fullList.stream().filter(l -> l.getStatus() == UserAnimeList.Status.DROPPED).count();

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole());
        profile.put("createdAt", user.getCreatedAt());
        profile.put("stats", Map.of(
                "watching", watching,
                "completed", completed,
                "planToWatch", planToWatch,
                "dropped", dropped
        ));

        return ResponseEntity.ok(profile);
    }

    // ── My List ──

    @PostMapping("/list")
    public ResponseEntity<Map<String, Object>> updateListStatus(@Valid @RequestBody UserListRequest request) {
        User user = securityUtil.getCurrentUser();
        UserAnimeList.Status status;

        try {
            status = UserAnimeList.Status.valueOf(request.getStatus());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status inválido: " + request.getStatus()));
        }

        UserAnimeList entry = userAnimeListRepository.findByUserIdAndAnimeId(user.getId(), request.getAnimeId())
                .orElse(UserAnimeList.builder()
                        .user(user)
                        .animeId(request.getAnimeId())
                        .build());

        entry.setStatus(status);
        entry.setUpdatedAt(LocalDateTime.now());
        userAnimeListRepository.save(entry);

        return ResponseEntity.ok(Map.of(
                "animeId", request.getAnimeId(),
                "status", status.name(),
                "message", "Status atualizado com sucesso"
        ));
    }

    @GetMapping("/list")
    public ResponseEntity<List<UserAnimeList>> getUserList(
            @RequestParam(required = false) String status) {
        User user = securityUtil.getCurrentUser();

        List<UserAnimeList> list;
        if (status != null && !status.isBlank()) {
            try {
                UserAnimeList.Status listStatus = UserAnimeList.Status.valueOf(status);
                list = userAnimeListRepository.findByUserIdAndStatus(user.getId(), listStatus);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        } else {
            list = userAnimeListRepository.findByUserId(user.getId());
        }

        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/list/{animeId}")
    public ResponseEntity<Void> removeFromList(@PathVariable Integer animeId) {
        User user = securityUtil.getCurrentUser();
        userAnimeListRepository.deleteByUserIdAndAnimeId(user.getId(), animeId);
        return ResponseEntity.noContent().build();
    }
}
