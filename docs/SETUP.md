## Development Setup

This document provides instructions for setting up the project locally, including Docker setup, environment variables, and how to run tests.

### Prerequisites

Before getting started, ensure you have the following installed:

- **Docker**: To run services in containers.
- **Node.js**: Version 20 or higher.

### Cloning the Repository

Clone the project repository to your local machine:

```bash
git clone https://github.com/patrick-selin/crm-app.git
cd crm-app
```

### Setting Up Environment Variables

#### /server Environment Setup

1. Rename the `.env.development.EXAMPLE` file to `.env.development` in the **/server** directory and fill in the necessary environment variables:

   ```bash
   # Server Configuration
   NODE_ENV=development
   SERVER_PORT=3333
   SERVER_HOST=0.0.0.0

   # JWTs
   JWT_SECRET=default-jwt-secret
   REFRESH_SECRET=default-refresh-secret

   # Database Connection
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=yourpassword
   POSTGRES_DB=crm_app_db_dev
   POSTGRES_HOST=database-sql
   DATABASE_URL=postgres://postgres:yourpassword@database-sql:5432/crm_app_db_dev
   ```

#### /client Environment Setup

2. Rename the `.env.development.EXAMPLE` file to `.env.development` in the **/client** directory and add the following environment variable:
   ```bash
   VITE_BASE_URL=/api/v1
   ```

#### /spring-boot Environment Setup

3. Rename the `.env.development.EXAMPLE` file to `.env.development` in the **/spring-boot** directory and fill in the necessary environment variables:
   ```bash
   # JWTs
   JWT_SECRET=default-jwt-secret
   REFRESH_SECRET=default-refresh-secret

   # Spring Boot Server
   SPRING_PROFILES_ACTIVE=development
   SPRING_DATASOURCE_URL=jdbc:postgresql://database-sql:5432/crm_app_db_dev
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=yourpassword
   SPRING_JPA_HIBERNATE_DDL_AUTO=validate
   ```

### Docker Setup
#### Running the Application

To run the application locally using Docker, ensure you have Docker installed and running. Use the following command to build and start all services (frontend, backend, Spring Boot, database, and reverse proxy):

```bash
npm run dev
```

or

```bash
docker-compose -f docker-compose.dev.yml up --build
```

This will start the following services:

- **client**: React SPA frontend.
- **server**: Node.js/Express backend (auth, customers, orders).
- **spring-server**: Spring Boot product catalog service.
- **database-sql**: PostgreSQL development database.
- **migrate**: Database migration service.
- **nginx**: Nginx reverse proxy for routing requests.

#### Stopping the Application

To stop all services, use the following command:

```bash
npm run dev:stop
```

or

```bash
docker-compose -f docker-compose.dev.yml down
```

#### Accessing the Application

After the services start, access the app in your browser at [http://localhost:80](http://localhost:80). Nginx serves the frontend and routes API requests to the appropriate backend services.

### Running Tests
**Note:** *All test scripts must be executed from the root directory of the project (crm-app).*

The project uses **Vitest** for unit and integration testing, and **Playwright** for end-to-end (E2E) testing. The **unit tests** use the development database, while the **integration** and **E2E tests** use the test database.


#### Unit Tests

1. Run server unit tests:
   ```bash
   npm run test:unit:server
   ```
2. Run client unit tests:
   ```bash
   npm run test:unit:client
   ```

#### Integration Tests

Run integration tests using the test database:
```bash
npm run test:integration:server"
```

#### End-to-End Tests

Run E2E tests using Playwright:
```bash
npm run test:e2e
```

