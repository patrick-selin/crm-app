# Project Name: CRM app

## Project Overview

This is a full-stack TypeScript application for bacis CRM. The app will support CI/CD pipelines, multi-environment deployments to AWS, and is being set up with infrastructure as code using Terraform.

## Table of Contents

- [Features](#features) | [Technologies](#technologies) | [Quick Start](#quick-start) | [Project Structure](#project-structure)| [Deployment](#deployment) | [Documentation](#documentation)

## Documentation

For detailed documentation on various aspects of the project, please refer to the following files:

- **[API.md](docs/API.md)**: API Overview, endpoint documentation, OpenAPI specification, authentication details, error handeling and routing.
- **ARCHITECTURE.md**: High-level overview of the app architecture and service descriptions.
- **CHANGELOG.md**: A log of project updates, features, and bug fixes.
- **CI/CD.md**: Overview of the CI/CD pipeline, GitHub Actions workflows.
- **DATA_MODELING.md**: Database schema, Drizzle ORM usage, migrations, and seeding data.
- **DEPLOYMENT.md**: Detailed deployment steps, Terraform setup and environment configurations.
- **[SETUP.md](docs/SETUP.md)**: Instructions for setting up the development environment locally with Docker, how to run tests and other commands.
- **[TESTING.md](docs/TESTING.md)**: Testing strategy.
- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)**: Common issues and debugging tips.

## Features

- **Dockerized development and production environment** for frontend and backend.
- **CI/CD pipeline** using GitHub Actions to automate testing, build, and deployment.
- **AWS deployment** using Terraform.
- Multi-environment setups (dev, staging, prod).
- **Unit and integration tests** for both frontend and backend.
- **End-to-end tests** to simulate real user interactions.

## Technologies

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL, Drizzle ORM
- **Infrastructure**: AWS, Terraform
- **CI/CD**: GitHub Actions, Docker
- **Testing**: Vitest (unit/integration), Playwright (end-to-end)

## Quick Start

### Prerequisites

- Docker
- Node.js

### Local Setup

1. Clone the repository: `git clone https://github.com/patrick-selin/crm-app.git`
2. Change to the project directory: `cd crm-app`
3. Rename the `.env.development.EXAMPLE` file to `.env.development` in the **/server** folder and **/client** folder, and fill in the necessary environment variables:

- For the **/server** folder, the following environment variables are required:

  ```bash
  # Server Connection
  NODE_ENV=development
  SERVER_PORT=3333
  SERVER_HOST=0.0.0.0

  # Database Connection
  POSTGRES_USER=postgres
  POSTGRES_PASSWORD=yourpassword
  POSTGRES_DB=postgres
  POSTGRES_HOST=database-sql # docker-compose service
  DATABASE_URL=postgres://postgres:yourpassword@pdatabase-sql:5432/postgres
  ```

- For the **/client** folder, the following environment variables are required:
  ```bash
  # Base URL for API requests
  VITE_BASE_URL=/api/v1
  ```

4. Build and start the app using NPM script that launches Docker Compose: `npm run dev`
5. Access the app at: [http://localhost:80](http://localhost:80)

For detailed setup instructions and information on running the tests, refer to the **[SETUP.md](docs/SETUP.md)**.

## Project Structure

The project consists of the following directories:

- **/client**: React app for the frontend.
- **/server**: Node.js/Express server for the backend.
- **/server/db**: PostgreSQL setup, Drizzle ORM, and migration scripts.
- **/terraform**: Infrastructure setup and provisioning using Terraform.
- **/docs**: Project documentation.
- **/.github/workflows**: GitHub Actions workflows for CI/CD pipelines.
- **/nginx**: Reverse proxy configuration.
- **/playwright-e2e**: End-to-end tests using Playwright.
- **/docker-compose.dev.yml**: Docker Compose configuration for local development.
