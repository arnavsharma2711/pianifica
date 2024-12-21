import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodIssue } from "zod";
import build_response from "./response/MessageResponse";
import { CustomError } from "./error/custom.error";

interface UserRequest extends Request {
  user?: {
    id: number;
    email: string;
    username: string;
    organization_id: number;
  };
}

type ControllerFunction = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const controllerWrapper = (
  fn: ControllerFunction
): ControllerFunction => {
  return async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res
          .status(error.status)
          .json(build_response(false, error.message, error.err_message, null));
      } else if (error instanceof ZodError) {
        if (error instanceof ZodError) {
          const zodError = error as ZodError;
          const errorMessages = JSON.stringify(
            zodError.errors.map((err: ZodIssue) => ({
              path: err.path.join("."),
              message: err.message,
            }))
          );
          res
            .status(400)
            .json(
              build_response(false, "Invalid Payload", errorMessages, null)
            );
        }
      } else {
        next(error);
      }
    }
  };
};
