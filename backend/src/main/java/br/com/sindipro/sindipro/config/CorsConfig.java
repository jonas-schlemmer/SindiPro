package br.com.sindipro.sindipro.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// CORS: por padrão o navegador BLOQUEIA o React (localhost:5173) de chamar a API (localhost:8080),
// porque são "origens" diferentes. Aqui a API avisa: "pode deixar, eu confio no localhost:5173".
// Sem isso, o fetch/axios do React falha com "blocked by CORS policy" mesmo com a API funcionando.
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
