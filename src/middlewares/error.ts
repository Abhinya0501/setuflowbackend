import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number | undefined;
    code?: number | undefined;
    keyValue?: Record<string, string> | undefined;
    path?: string;
    name: string;
    message: string;
    stack?: string;
}

class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = {...err} ;

  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Internal server error.";

  if (error.name === "CastError") {
    error = new ErrorHandler(`Invalid ${error.path}`, 400);
  }

  if (error.name === "JsonWebTokenError") {
    error = new ErrorHandler("JWT is invalid, try again.", 401);
  }

  if (error.name === "TokenExpiredError") {
    error = new ErrorHandler("JWT is expired, try again.", 401);
  }

  if (error.code === 11000 && error.keyValue) {
    error = new ErrorHandler(
      `Duplicate ${Object.keys(error.keyValue).join(", ")} entered`,
      400
    );
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

export default ErrorHandler;
