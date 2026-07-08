package com.animalisty.controller;

import com.animalisty.service.JikanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/animes")
public class AnimeController {

    private final JikanService jikanService;

    public AnimeController(JikanService jikanService) {
        this.jikanService = jikanService;
    }

    @GetMapping("/season")
    public Mono<ResponseEntity<Map>> getSeasonNow() {
        return jikanService.getSeasonNow()
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.noContent().build());
    }

    @GetMapping("/top")
    public Mono<ResponseEntity<Map>> getTopAnime() {
        return jikanService.getTopAnime()
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.noContent().build());
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<Map>> searchAnime(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String orderBy,
            @RequestParam(defaultValue = "1") int page) {
        return jikanService.searchAnime(q, genre, year, orderBy, page)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.noContent().build());
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Map>> getAnimeById(@PathVariable int id) {
        return jikanService.getAnimeById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
