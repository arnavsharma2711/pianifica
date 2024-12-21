import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodIssue } from "zod";
import { CustomError } from "./error/custom.error";
import {
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library";

type ControllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const controllerWrapper = (fn: ControllerFunction): ControllerFunction => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.failure({
          status: error.status,
          message: error.message,
          error: error.err_message,
        });
      } else if (error instanceof ZodError) {
        const zodError = error as ZodError;
        const errorMessages = JSON.stringify(
          zodError.errors.map((err: ZodIssue) => ({
            path: err.path.join("."),
            message: err.message,
          }))
        );
        res.invalid({
          message: "Invalid Payload",
          error: errorMessages,
        });
      } else if (error instanceof PrismaClientValidationError) {
        res.failure({
          status: 400,
          message: "Validation Error",
          error: "An error occurred while validating the request",
        });
      } else if (error instanceof PrismaClientKnownRequestError) {
        res.failure({
          status: 400,
          message: "Database Error",
          error: "An error occurred while processing the request",
        });
      } else if (error instanceof PrismaClientUnknownRequestError) {
        res.failure({
          status: 500,
          message: "Unknown Database Error",
          error: "An unknown error occurred while processing the request",
        });
      } else {
        next(error);
      }
    }
  };
};

export default controllerWrapper;
