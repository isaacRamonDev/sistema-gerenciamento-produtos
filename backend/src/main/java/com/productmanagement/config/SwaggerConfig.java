package com.productmanagement.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Sistema de Gerenciamento de Produtos API")
                        .version("1.0.0")
                        .description("API REST para gerenciamento de produtos com operações CRUD completas")
                        .contact(new Contact()
                                .name("Equipe de Desenvolvimento")
                                .email("dev@productmanagement.com")));
    }
}