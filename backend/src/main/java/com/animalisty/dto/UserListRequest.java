package com.animalisty.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserListRequest {

    @NotNull(message = "animeId é obrigatório")
    private Integer animeId;

    @NotNull(message = "Status é obrigatório")
    private String status;
}
