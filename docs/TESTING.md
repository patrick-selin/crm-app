
# Testing Strategy

This document outlines the testing tools, types of tests, and best practices used in this project.

## Testing Types

- **Unit Tests**: Validate individual functions or components in isolation.
- **Integration Tests**: Test how components or systems work together.

## Tools

- **Vitest**: Framework for unit and integration tests.
- **Supertest**: HTTP API testing for backend integration tests.
- **React Testing Library**: Tests user interactions and DOM behavior in React components.
- **Mock Service Worker**: Mocks API requests for frontend tests to ensure isolation.

## Test Locations

- **Unit Tests**: Next to source files:
  - Frontend: `/client/src/*`
  - Backend: `/server/src/*`
- **Integration Tests**: `/server/src/tests`

## Coverage

- Target **80%+ test coverage** for unit and integration tests.
- Use `--coverage` with Vitest to generate reports.

## CI/CD Pipeline

Tests are run automatically in CI workflows:
1. Unit Tests, Linting, Typecheck (every commit)
2. Integration Tests, when merged or pushed to dev branch (staging branch)

## Troubleshooting

- Ensure required services (client, server, database) are running.
- Use `docker-compose logs` to debug issues.

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest  Documentation](https://github.com/ladjs/supertest#readme/)
- [Mock Service Worker Documentation](https://mswjs.io/docs/)

