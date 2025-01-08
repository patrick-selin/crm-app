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
  public logError?: unknown;

  /**
   * @param {string} name
   * @param {number} statusCode
   * @param {string} message
   * @param {boolean} isOperational
   * @param {unknown} errorStack
   * @param {unknown} loggingErrorResponse
   */
  constructor(
    name: string,
    statusCode: number = HttpStatusCodes.INTERNAL_ERROR,
    message = "Something went wrong",
    isOperational = true,
    errorStack?: unknown,
    loggingErrorResponse?: unknown
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorStack = errorStack;
    this.logError = loggingErrorResponse;

    Error.captureStackTrace(this, this.constructor);
  }
}

// API Specific Errors
export class APIError extends AppError {
  constructor(
    name: string,
    statusCode: number = HttpStatusCodes.INTERNAL_ERROR,
    message = "Internal Server Error",
    isOperational = true
  ) {
    super(name, statusCode, message, isOperational);
  }
}

// Client-side input problems
export class BadRequestError extends AppError {
  constructor(message = "Bad Request", loggingErrorResponse?: unknown) {
    super(
      "BAD_REQUEST",
      HttpStatusCodes.BAD_REQUEST,
      message,
      true,
      undefined,
      loggingErrorResponse
    );
  }
}

// Validation failures.
export class ValidationError extends AppError {
  constructor(message = "Validation Error", errorStack?: unknown) {
    super(
      "VALIDATION_ERROR",
      HttpStatusCodes.BAD_REQUEST,
      message,
      true,
      errorStack
    );
  }
}
