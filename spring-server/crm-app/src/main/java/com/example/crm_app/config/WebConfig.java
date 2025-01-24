package com.example.crm_app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.UrlHandlerFilter;

@Configuration
public class WebConfig {

    @Bean
    public UrlHandlerFilter urlHandlerFilter() {
        return UrlHandlerFilter
                .trailingSlashHandler("/api/v1/products/**").wrapRequest()
                .trailingSlashHandler("/api/v1/**").redirect(HttpStatus.PERMANENT_REDIRECT)
                .build();
    }
}