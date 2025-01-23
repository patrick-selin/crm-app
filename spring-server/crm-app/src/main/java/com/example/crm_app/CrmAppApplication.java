package com.example.crm_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class})
public class CrmAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrmAppApplication.class, args);
	}
}