import type { NextFunction, Request, Response } from "express";
import { GENERIC_ERROR_MESSAGE, NOT_FOUND_MESSAGE } from "../constants";

export function handleNotFound(req: Request, res: Response) {
  res.failure({
    status: 404,
    message: NOT_FOUND_MESSAGE,
    error: ` Not Found - ${req.method} ${req.originalUrl}`,
  });
}

export function handleError(req: Request, res: Response, next: NextFunction) {
  res.failure({
    message: GENERIC_ERROR_MESSAGE,
  });
  next();
}

export default { handleNotFound, handleError };
