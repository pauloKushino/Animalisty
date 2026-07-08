package com.animalisty.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class JikanService {

    private final WebClient jikanWebClient;

    public JikanService(@Qualifier("jikanWebClient") WebClient jikanWebClient) {
        this.jikanWebClient = jikanWebClient;
    }

    @Cacheable(value = "jikanSeason", unless = "#result == null")
    public Mono<Map> getSeasonNow() {
        return jikanWebClient.get()
                .uri("/seasons/now")
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorResume(this::handleError);
    }

    @Cacheable(value = "jikanTop", unless = "#result == null")
    public Mono<Map> getTopAnime() {
        return jikanWebClient.get()
                .uri("/top/anime")
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorResume(this::handleError);
    }

    @Cacheable(value = "jikanSearch", unless = "#result == null")
    public Mono<Map> searchAnime(String q, String genre, String year, String orderBy, int page) {
        return jikanWebClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.path("/anime")
                            .queryParam("page", page)
                            .queryParam("sfw", true);
                    if (q != null && !q.isBlank()) uriBuilder.queryParam("q", q);
                    if (genre != null && !genre.isBlank()) uriBuilder.queryParam("genres", genre);
                    if (year != null && !year.isBlank()) {
                        uriBuilder.queryParam("start_date", year + "-01-01");
                        uriBuilder.queryParam("end_date", year + "-12-31");
                    }
                    if (orderBy != null && !orderBy.isBlank()) uriBuilder.queryParam("order_by", orderBy);
                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorResume(this::handleError);
    }

    @Cacheable(value = "jikanAnimes", key = "#id", unless = "#result == null")
    public Mono<Map> getAnimeById(int id) {
        return jikanWebClient.get()
                .uri("/anime/{id}/full", id)
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorResume(this::handleError);
    }

    private Mono<Map> handleError(Throwable error) {
        // Return empty to avoid caching error responses
        return Mono.empty();
    }
}
