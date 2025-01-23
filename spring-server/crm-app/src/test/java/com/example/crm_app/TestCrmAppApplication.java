package com.example.crm_app;

import org.springframework.boot.SpringApplication;

public class TestCrmAppApplication {

	public static void main(String[] args) {
		SpringApplication.from(CrmAppApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
