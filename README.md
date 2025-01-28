# CRM Appi
[Staging Site](https://staging.crm-appi.live/) - Here you can demo the app. Feel free to add, delete, update, and search customer data.

## Project Overview
A full-stack CRM application to manage customer data and metrics. Built with TypeScript, React, Node.js, Java/Spring Boot and PostgreSQL, this project demonstrates:

- **Secure, scalable backend services** with JWT-based authentication.
- **Modular, test-driven architecture** with Vitest and Supertest.
- **Automated CI/CD pipelines** with GitHub Actions and Docker.
- **AWS deployment** using Terraform.

This application is part of a **microservice architecture**, which will include a Java/Spring Boot server with Hibernate for the product catalog.

The infrastructure leverages **AWS services**, including EC2, RDS, ECR, and ECS.

Explore the repository for more details on the architecture, API documentation and testing strategy.

## Table of Contents
- [Features](#features) | [Technologies](#technologies) | [Quick Start](#quick-start) | [Project Structure](#project-structure) | [Documentation](#documentation)

## Features

- **Frontend capabilities**: Responsive UI, reusable components, React Router for navigation and Stack Query for server state management and caching.
- **Validation**: Ensures data integrity on both client and server.
- **Error handling**: User-friendly notifications and logging.
- **Customer management**: CRUD operations with server-side pagination, search, sort, and filters.
- **Fully dockerized environment** for both development, CI/CD testing and staging.
- **CI/CD pipelines**: Automated testing, build, and deployment processes.
- **Comprehensive testing**: Unit, and integration tests using modern testing frameworks.

## Technologies

- **Frontend**: React, TypeScript, CSS, Mantine UI, React Router, Tansctack Query
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL, Drizzle ORM
- **Infrastructure**: AWS (EC2, RDS, ECR, ECS), Terraform
- **CI/CD**: GitHub Actions, Docker
- **Testing**: Vitest, Supertest, React Testing Library (unit/integration)

## Quick Start

### Prerequisites

- Docker
- Node.js

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/patrick-selin/crm-app.git
   ```
2. Change to the project directory:
   ```bash
   cd crm-app
   ```
3. Rename the `.env.development.EXAMPLE` file to `.env.development` in the **/server** folder, **/client** folder, and **/spring-boot** folder, and fill in the necessary environment variables:

   **/server/.env.development**:
   ```bash
    # JWTs
   JWT_SECRET=default-jwt-secret
   REFRESH_SECRET=default-refresh-secret
   
   NODE_ENV=development
   SERVER_PORT=3333
   SERVER_HOST=0.0.0.0
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=yourpassword
   POSTGRES_DB=crm_app_db_dev
   POSTGRES_HOST=database-sql
   DATABASE_URL=postgres://postgres:yourpassword@database-sql:5432/crm_app_db_dev
   ```

   **/client/.env.development**:
   ```bash
   VITE_BASE_URL=/api/v1
   ```

   **/spring-boot/.env.development**:
   ```bash
   # JWTs
   JWT_SECRET=default-jwt-secret
   REFRESH_SECRET=default-refresh-secret

   # SPRING BOOT SERVER
   SPRING_PROFILES_ACTIVE=development
   SPRING_DATASOURCE_URL=jdbc:postgresql://database-sql:5432/crm_app_db_dev
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=yourpassword
   SPRING_JPA_HIBERNATE_DDL_AUTO=validate
   ```

4. Build and start the app using Docker Compose:
   ```bash
   npm run dev
   ```
5. Access the app at:
   [http://localhost:80](http://localhost:80)

For detailed setup instructions, see the **[SETUP.md](docs/SETUP.md)** file.

## Project Structure

The project consists of the following directories:

- **/.github/workflows**: GitHub Actions workflows for CI/CD pipelines.
- **/client**: React app for the frontend.
- **/docs**: Project documentation.
- **/nginx**: Reverse proxy configuration.
- **/server**: Typescript/Node.js/Express server for the backend.
- **/server/db**: PostgreSQL setup, Drizzle ORM, and migration scripts.
- **/spring-boot**: Java/Spring Boot server for the product catalog.
- **/terraform**: Infrastructure setup and provisioning using Terraform.

## Documentation

For more detailed documentation, see:

- **[API Documentation](docs/API.md)**: Endpoints, request/response samples, data validation, authentication, and error handling.
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: High-level overview of the app's architecture.
- **[SETUP.md](docs/SETUP.md)**: Detailed setup instructions.
- **[TESTING.md](docs/TESTING.md)**: Testing strategy and tools.

