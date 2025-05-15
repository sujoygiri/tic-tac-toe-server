import { Request, Response, NextFunction } from "express";

interface ErrorResponse {
  status: number;
  message: string;
  stack?: string;
}

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let errorResponse: ErrorResponse = {
    status: 500,
    message: "Internal Server Error",
  };

  if (err instanceof AppError) {
    errorResponse.status = err.statusCode;
    errorResponse.message = err.message;
  }

  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }
  console.log(errorResponse);
  res.status(errorResponse.status).json(errorResponse);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};
