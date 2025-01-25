package com.example.crm_app;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class CrmAppApplicationTests {

	@Autowired
	private ApplicationContext applicationContext;

	@Test
	void contextLoads() {
		assertThat(applicationContext).isNotNull();
	}

	@Test
	void shouldHaveRequiredBeans() {
		assertThat(applicationContext.containsBean("crmAppApplication")).isTrue();
		assertThat(applicationContext.containsBean("entityManagerFactory")).isTrue();
		assertThat(applicationContext.containsBean("dataSource")).isTrue();
	}

	@Test
	void applicationStartsWithoutErrors() {
		// This ensures the application starts and does not throw exceptions
		CrmAppApplication.main(new String[] {});
	}
}