package com.example.crm_app.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.SQLException;

@SpringBootTest
public class DatabaseTest {

    @Autowired
    private DataSource dataSource;

    @Test
    public void testDatabaseConnection() throws SQLException {
        System.out.println("Using database: " + dataSource.getConnection().getMetaData().getURL());
        System.out.println("Database username: " + dataSource.getConnection().getMetaData().getUserName());
             }
}