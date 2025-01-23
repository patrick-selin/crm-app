package com.example.crm_app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/products")
public class ProductTestController {

    @GetMapping("/test")
    public List<Map<String, Object>> getProductTest() {
        return List.of(
                Map.of(
                        "id", "1",
                        "name", "Laptop",
                        "price", 899.0,
                        "stock", 15,
                        "category", "Electronics"
                ),
                Map.of(
                        "id", "2",
                        "name", "Phone",
                        "price", 279.0,
                        "stock", 20,
                        "category", "Electronics"
                )
        );
    }
}
