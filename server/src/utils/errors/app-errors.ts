// src/errors/app-errors.ts

export enum HttpStatusCodes {
  OK = 200,
  BAD_REQUEST = 400,
  UN_AUTHORISED = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

// Base error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errorStack?: unknown;

  public devMessage?: string;
  public userMessage?: string;

  constructor(
    name: string,
    statusCode: number = HttpStatusCodes.INTERNAL_ERROR,
    userMessage = "Something went wrong",
    devMessage = "An unexpected error occurred",
    isOperational = true,
    errorStack?: unknown
  ) {
    super(devMessage);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorStack = errorStack;

    this.devMessage = devMessage;
    this.userMessage = userMessage;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class APIError extends AppError {
  constructor(
    name: string,
    statusCode: number = HttpStatusCodes.INTERNAL_ERROR,
    userMessage = "Internal Server Error",
    devMessage = "An unexpected server error occurred",
    isOperational = true
  ) {
    super(name, statusCode, userMessage, devMessage, isOperational);
  }
}

export class BadRequestError extends AppError {
  constructor(
    userMessage = "Bad Request",
    devMessage = "Invalid request parameters",
    errorStack?: unknown
  ) {
    super(
      "BAD_REQUEST",
      HttpStatusCodes.BAD_REQUEST,
      userMessage,
      devMessage,
      true,
      errorStack
    );
  }
}

export class ValidationError extends AppError {
  constructor(
    userMessage = "Validation Error",
    devMessage = "Schema validation failed",
    errorStack?: unknown
  ) {
    super(
      "VALIDATION_ERROR",
      HttpStatusCodes.BAD_REQUEST,
      userMessage,
      devMessage,
      true,
      errorStack
    );
  }
}
