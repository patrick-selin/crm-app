package com.example.crm_app.controller;

import com.example.crm_app.entity.Product;
import com.example.crm_app.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private ProductRepository productRepository;

//    @GetMapping
    @GetMapping()
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/db-info-two")
    public Map<String, String> getDatabaseInfo() throws SQLException {
        Map<String, String> dbInfo = new HashMap<>();
        dbInfo.put("Database URL", dataSource.getConnection().getMetaData().getURL());
        dbInfo.put("Database Username", dataSource.getConnection().getMetaData().getUserName());
        return dbInfo;
    }
}