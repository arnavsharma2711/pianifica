import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodIssue } from "zod";
import { CustomError } from "./error/custom.error";

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
        if (error instanceof ZodError) {
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
        }
      } else {
        next(error);
      }
    }
  };
};

export default controllerWrapper;
