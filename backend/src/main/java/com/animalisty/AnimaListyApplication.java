package com.animalisty;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class AnimaListyApplication {

    public static void main(String[] args) {
        SpringApplication.run(AnimaListyApplication.class, args);
    }
}
