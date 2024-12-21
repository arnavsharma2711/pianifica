import type { NextFunction, Request, Response } from "express";
import { GENERIC_ERROR_MESSAGE, NOT_FOUND_MESSAGE } from "../constants";

export function handleNotFound(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.failure({
    status: 404,
    message: NOT_FOUND_MESSAGE,
    error: ` Not Found - ${req.method} ${req.originalUrl}`,
  });
  next();
}

export function handleError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof SyntaxError) {
    res.failure({
      status: 400,
      message: "Invalid JSON payload",
      error: err.message,
    });
  } else {
    res.failure({
      message: GENERIC_ERROR_MESSAGE,
      error: err.message,
    });
  }
  next();
}

export default { handleNotFound, handleError };
