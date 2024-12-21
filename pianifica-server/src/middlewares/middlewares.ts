import type ErrorResponseInterface from "../lib/response/ErrorResponse";
import type { NextFunction, Request, Response } from "express";
import {
  APPLICATION_ENVIRONMENT,
  GENERIC_ERROR_MESSAGE,
  NOT_FOUND_MESSAGE,
} from "../constants";

export function handleNotFound(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(404);
  next(new Error(` Not Found - ${req.method} ${req.originalUrl}`));
}

export function handleError(
  err: Error,
  _req: Request,
  res: Response<ErrorResponseInterface>,
  next: NextFunction
) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    success: false,
    message: statusCode === 404 ? NOT_FOUND_MESSAGE : GENERIC_ERROR_MESSAGE,
    error: err.message,
    stack: APPLICATION_ENVIRONMENT === "production" ? undefined : err.stack,
  });
  next();
}

export default { handleNotFound, handleError };
