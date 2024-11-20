# Project Name: Coding Challenge Platform 

## Project Overview 
This is a full-stack TypeScript application that allows users to solve coding challenges. The app will support CI/CD pipelines, multi-environment deployments to AWS, and is being set up with infrastructure as code using Terraform. 

## Table of Contents 
- [Features](#features) | [Technologies](#technologies) | [Quick Start](#quick-start) | [Project Structure](#project-structure)| [Deployment](#deployment) | [Documentation](#documentation)

## Documentation
For detailed documentation on various aspects of the project, please refer to the following files:

- **[API.md](docs/API.md)**: API Overview, endpoint documentation, OpenAPI specification, authentication details, and routing.
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: High-level overview of the app architecture, service descriptions, error handling, and security considerations.
- **[CHANGELOG.md](docs/CHANGELOG.md)**: A log of project updates, features, and bug fixes.
- **[CI/CD.md](docs/CI/CD.md)**: Overview of the CI/CD pipeline, GitHub Actions workflows.
- **[DATA_MODELING.md](docs/DATA_MODELING.md)**: Database schema, Drizzle ORM usage, migrations, and seeding data.
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)**: Detailed deployment steps, Terraform setup and environment configurations.
- **[SETUP.md](docs/SETUP.md)**: Instructions for setting up the development environment locally, Docker, and testing. For detailed setup instructions and how to run the tests, refer to the **Testing Setup** section in this file.
- **[TESTING.md](docs/TESTING.md)**: Testing strategy, running unit, integration and E2E tests.
- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)**: Common issues and debugging tips.

## Features 
- **Dockerized development and production environment** for frontend and backend. 
- **CI/CD pipeline** using GitHub Actions to automate testing, build, and deployment. 
- **AWS deployment** using Terraform. - Multi-environment setups (dev, staging, prod). 
- **Unit and integration tests** with Vitest for both frontend and backend. 
- **End-to-end tests** using Playwright to simulate real user interactions.

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
1. Clone the repository: `git clone https://github.com/patrick-selin/coding-app.git` 
2. Change to the project directory: `cd coding-app` 
3. Rename the `.env.development.EXAMPLE` file to `.env.development` in the **/server** folder and **/client** folder, and fill in the necessary environment variables: - For the **/server** folder, the following environment variables are required: 
	```bash
	# Server Connection  
	NODE_ENV=development 
	SERVER_PORT=3333 
	SERVER_HOST=0.0.0.0 
	
	# Database Connection 
	POSTGRES_USER=postgres 
	POSTGRES_PASSWORD=yourpassword POSTGRES_DB=postgres 
	DATABASE_URL=postgres://postgres:yourpassword@postgres:5432/postgres
	```
5. Build and start the app using NPM script that launches Docker Compose: `npm run dev` 
6. Access the app at: [http://localhost:80](http://localhost:80) 

For detailed setup instructions and information on running the tests, refer to the SETUP.md. 

## Project Structure 
The project consists of the following directories: 
- **/client**: React app for the frontend. 
- **/server**: Node.js/Express server for the backend. This folder also contains PostgreSQL setup, Drizzle ORM, and migration scripts.
- **/terraform**: Infrastructure setup and provisioning using Terraform. 
- **/docs**: Project documentation. 
- **/.github/workflows**: GitHub Actions workflows for CI/CD pipelines. 
- **/nginx**: Reverse proxy configuration. 
- **/playwright-e2e**: End-to-end tests using Playwright. 
- **/docker-compose.dev.yml**: Docker Compose configuration for local development.

## Deployment 
The app is deployed to AWS using Terraform. For more details, check out the [Deployment Guide](docs/DEPLOYMENT.md). 