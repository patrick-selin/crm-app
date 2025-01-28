# API Documentation

The API endpoints available, request/response examples, authentication, and error handling.

## Table of Contents

- [API Documentation](#api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Base URL](#base-url)
  - [Authentication Overview](#authentication-overview)
    - [JWT Authentication](#jwt-authentication)
    - [Token Validation](#token-validation)
    - [Refresh Token Endpoint](#refresh-token-endpoint)
  - [Schema Validation with Zod](#schema-validation-with-zod)
  - [Error Handling and Middleware](#error-handling-and-middleware)
    - [Centralized Error Handling](#centralized-error-handling)
    - [Common HTTP Status Codes](#common-http-status-codes)
    - [Authentication Middleware](#authentication-middleware)
    - [Logging with Morgan](#logging-with-morgan)
    - [Example Middleware Configuration](#example-middleware-configuration)
  - [Endpoints](#endpoints)
    - [1. **Authentication**](#1-authentication)
      - [POST `/auth/register`](#post-authregister)
      - [POST `/auth/login`](#post-authlogin)
      - [GET `/auth/me`](#get-authme)
      - [POST `/auth/refresh`](#post-authrefresh)
    - [2. **Customers**](#2-customers)
      - [GET `/customers`](#get-customers)
      - [GET `/customers/summary`](#get-customerssummary)
      - [GET `/customers/:id`](#get-customersid)
      - [GET `/customers/:id/orders`](#get-customersidorders)
      - [GET `/customers/:id/orders/:orderId`](#get-customersidordersorderid)
      - [POST `/customers`](#post-customers)
      - [PUT `/customers/:id`](#put-customersid)
      - [DELETE `/customers/:id`](#delete-customersid)
    - [3. **Health Check**](#3-health-check)
      - [GET `/health`](#get-health)
      - [GET `/health/json`](#get-healthjson)

---

## Base URL

All API endpoints are prefixed with the following base URL:

```
http://localhost:80/api/v1
```

## Authentication Overview

### JWT Authentication

The app uses **JSON Web Tokens (JWT)** for secure authentication and session management:

- **Access Tokens**: Short-lived tokens (15 minutes) for request authentication.
- **Refresh Tokens**: Long-lived tokens (14 days) for renewing access tokens.

**Flow**:

1. Log in with valid credentials to receive access and refresh tokens.
2. Include the access token in the `Authorization` header for requests:
   ```
   Authorization: Bearer <access_token>
   ```
3. Use the refresh token to get a new access token when the current one expires.

### Token Validation

- Validated using `jsonwebtoken`.
- Token payloads are validated with **Zod schemas**.

### Refresh Token Endpoint

Endpoint `/auth/refresh` generates new access tokens using a refresh token.

---

## Schema Validation with Zod

**Zod** is used to validate:

- **Request Bodies**: Ensures data matches expected formats.
- **Token Payloads**: Validates JWT payloads.

**Example Schema**:

```typescript
const JwtPayloadSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["admin", "user"]),
  iat: z.number(),
  exp: z.number(),
});
```

---

## Error Handling and Middleware

### Centralized Error Handling

The app manages errors consistently through middleware:

1. **Validation Errors**:

   - Triggered when schemas fail validation.
   - Response:
     ```json
     {
       "error": "Validation Error",
       "details": [{ "path": ["email"], "message": "Invalid email address" }]
     }
     ```

2. **Custom Application Errors**:

   - `AppError` class handles specific errors (e.g., unauthorized access).
   - Responses can include a `devMessage` for debugging:
     ```json
     {
       "error": "UnauthorizedError",
       "message": "Invalid token",
       "devMessage": "JWT signature verification failed",
       "statusCode": 401
     }
     ```

3. **Unhandled Errors**:
   - Logs unexpected errors and returns a generic `500` response:
     ```json
     {
       "error": "Internal Server Error",
       "message": "An unexpected error occurred.",
       "statusCode": 500
     }
     ```

### Common HTTP Status Codes

- **200 OK**: Request succeeded.
- **400 Bad Request**: Validation or malformed request errors.
- **401 Unauthorized**: Authentication failure.
- **403 Forbidden**: Access denied.
- **404 Not Found**: Resource not found.
- **409 Conflict**: Duplicate or conflicting resources.
- **500 Internal Server Error**: Unexpected server error.

### Authentication Middleware

The `authenticateJWT` middleware:

- Verifies JWTs from the `Authorization` header.
- Validates token payloads with `JwtPayloadSchema`.
- Attaches user info to `req.user`.

**Example**:

```typescript
app.use("/api/v1/customers", authenticateJWT, customerRoutes);
```

### Logging with Morgan

The app uses **Morgan** for HTTP request logging:

- Logs request method, URL, status, and response time.
- Assists in monitoring and debugging.

**Example**:

```typescript
import morgan from "morgan";
app.use(morgan("combined"));
```

### Example Middleware Configuration

**Error Handler**:
Handles and logs errors.

```typescript
app.use(errorHandler);
```

**Validation Middleware**:
Ensures requests match schemas.

```typescript
authRoutes.post("/login", validateBody(LoginSchema), authController.loginUser);
```

---

## Endpoints

### 1. **Authentication**

#### POST `/auth/register`

Register a new user.

- **Request Body**:

  ```json
  {
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "phone": "123-456-7890",
    "address": "123 Main St",
    "city": "Helsinki",
    "postalCode": "00100",
    "country": "Finland"
  }
  ```

- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "ea10cfb3-5ff4-4b24-93fd-5adfe936d010",
      "username": "johndoe",
      "email": "johndoe@example.com"
    }
  }
  ```

#### POST `/auth/login`

Authenticate a user and retrieve a JWT token.
- **Request Body**:

  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```

- **Response**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "12345678-1234-1234-1234-1234567890ab",
      "firstName": "John",
      "email": "johndoe@example.com",
      "role": "user"
    }
  }
  ```

#### GET `/auth/me`

Retrieve details of the authenticated user.

- **Response**:
  ```json
  {
    "id": "12345678-1234-1234-1234-1234567890ab",
    "firstName": "John",
    "email": "johndoe@example.com",
    "role": "user"
  }
  ```

#### POST `/auth/refresh`

Refresh the access token using a refresh token.

- **Request Body**:

  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

- **Response**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

### 2. **Customers**

#### GET `/customers`

Retrieve a list of customers with optional filters and pagination.

- **Query Parameters**:

  - `page`: Page number (default: 1).
  - `limit`: Items per page (default: 10).
  - `search`: Search term for customer names.

- **Response**:

  ```json
  {
    "total": "99",
    "page": 1,
    "limit": 10,
    "data": [
      {
        "customerId": "c6ed9874-dc80-40f3-a996-c2a8b9479ade",
        "firstName": "Mona",
        "lastName": "King",
        "email": "customer-0c498996@example.com",
        "phone": "555-4050",
        "address": "692 Main St",
        "city": "Dallas",
        "postalCode": "34080",
        "country": "Germany",
        "createdAt": "2025-01-27T17:00:00.311Z",
        "updatedAt": "2025-01-27T17:00:00.311Z"
      },
      {
        "customerId": "0de90133-ab63-40ee-ab74-43d305c645ce",
        "firstName": "Charlie",
        "lastName": "Taylor",
        "email": "customer-df1d049a@example.com",
        "phone": "555-6280",
        "address": "430 Main St",
        "city": "Philadelphia",
        "postalCode": "57100",
        "country": "Finland",
        "createdAt": "2025-01-26T18:00:00.890Z",
        "updatedAt": "2025-01-27T12:32:15.353Z"
      }
    ]
  }
  ```

  #### GET `/customers/summary`

  Retrieve a summary of customer metrics, including total spent, number of orders, and last order date.

- **Response**:
  ```json
  {
    "total": "100",
    "page": 1,
    "limit": 10,
    "data": [
      {
        "customerId": "1f938068-8232-44ed-954c-ad063237e148",
        "firstName": "Frank",
        "lastName": "Lewis",
        "email": "customer-7eb45cd7@example.com",
        "lastOrderDate": "2025-01-28T09:00:00.098Z",
        "numOfOrders": 1,
        "totalSpent": 4605.52
      },
      {
        "customerId": "c6ed9874-dc80-40f3-a996-c2a8b9479ade",
        "firstName": "Mona",
        "lastName": "King",
        "email": "customer-0c498996@example.com",
        "lastOrderDate": "2025-01-28T08:00:00.447Z",
        "numOfOrders": 7,
        "totalSpent": 24914.65
      }
    ]
  }
  ```

#### GET `/customers/:id`

Retrieve detailed information about a specific customer.

- **Response**:
  ```json
  {
    "customerId": "81ce3a22-bed7-4252-bf38-57bd655043ec",
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "customer29@example.com",
    "phone": "555-6004",
    "address": "474 Random St",
    "city": "City 1",
    "postalCode": "75400",
    "country": "USA",
    "createdAt": "2025-01-15T14:41:37.478Z",
    "updatedAt": "2025-01-15T14:41:37.478Z"
  }
  ```

#### GET `/customers/:id/orders`

Retrieve all orders associated with a specific customer.

- **Response**:
  ```json
  [
    {
      "orderId": "6b36de67-4867-457f-ad85-4084204b75cf",
      "totalAmount": 4050.75,
      "paymentStatus": "Completed",
      "orderDate": "2025-01-17T08:00:00.773Z"
    },
    {
      "orderId": "50fd0732-6ef1-4867-8bc1-c37825188213",
      "totalAmount": 3546.8,
      "paymentStatus": "Completed",
      "orderDate": "2025-01-17T09:00:00.056Z"
    }
  ]
  ```

#### GET `/customers/:id/orders/:orderId`

Retrieve detailed information about a specific order for a customer.

- **Response**:
  ```json
  {
    "order": {
      "orderId": "6b36de67-4867-457f-ad85-4084204b75cf",
      "customerId": "a3cd1535-5cfb-4e9d-a200-87919f6890f5",
      "totalAmount": 4050.75,
      "paymentStatus": "Completed",
      "orderDate": "2025-01-17T08:00:00.773Z",
      "createdAt": "2025-01-17T08:00:00.773Z",
      "updatedAt": "2025-01-17T08:00:00.773Z"
    },
    "items": [
      {
        "orderItemId": "f6a4c0ba-65b5-4d7c-9875-a865f880491e",
        "orderId": "6b36de67-4867-457f-ad85-4084204b75cf",
        "productId": "31700e51-a779-4ab7-970d-c6e43b642c6e",
        "quantity": 3,
        "price": 501.69
      },
      {
        "orderItemId": "54c0805b-584b-4f4f-b0aa-65492e822bb1",
        "orderId": "6b36de67-4867-457f-ad85-4084204b75cf",
        "productId": "e91267eb-124d-4160-a7d3-c7d8c599eae0",
        "quantity": 2,
        "price": 312.1
      }
    ]
  }
  ```

#### POST `/customers`

Create a new customer.

- **Request Body**:
  ```json
  {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "phone": "123-456-7890",
    "address": "123 Elm St",
    "city": "Somewhere",
    "postalCode": "12345",
    "country": "USA"
  }
  ```

- **Response**:
  ```json
  {
    "customerId": "b345b7ed...",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "phone": "123-456-7890",
    "address": "123 Elm St",
    "city": "Somewhere",
    "postalCode": "12345",
    "country": "USA",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-28T08:56:16.164Z"
  }
  ```

#### PUT `/customers/:id`

Update an existing customer's information.

- **Request Body**:

  ```json
  {
    "firstName": "John New Name",
    "country": "Germany"
  }
  ```

- **Response**:
  ```json
  {
    "customerId": "81ce3a22....",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phone": "987-654-3210",
    "address": "456 Oak St",
    "city": "Elsewhere",
    "postalCode": "67890",
    "country": "Canada",
    "updatedAt": "2025-01-02T00:00:00Z",
    "updatedAt": "2025-01-15T14:41:37.478Z"
  }
  ```

#### DELETE `/customers/:id`

Delete a customer by ID.

---

### 3. **Health Check**

#### GET `/health`

Returns a simple HTML page indicating the application's health status.

- **Response**:
  ```html
  <html>
    <head>
      <title>Health Check</title>
    </head>
    <body>
      <h1>Health Check: OK</h1>
      <p>The system is up and running.</p>
    </body>
  </html>
  ```

#### GET `/health/json`

Returns a JSON response indicating the application's health status.

- **Response**:
  ```json
  {
    "status": "OK"
  }
  ```
