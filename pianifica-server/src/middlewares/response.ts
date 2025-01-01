import type { Request, Response, NextFunction } from "express";

interface Payload {
  message?: string;
  success?: boolean;
  status?: number;
  error?: string | null;
  total_count?: number | null;
  data?: object | unknown[] | null;
}

export default (_req: Request, res: Response, next: NextFunction) => {
  res.invalid = ({
    status = 400,
    message = "Invalid Parameters",
    error = null,
  }: Payload) =>
    res.status(status).json({
      success: false,
      message,
      error,
    });

  res.failure = ({
    status = 500,
    message = "Something went wrong",
    error = null,
  }: Payload) =>
    res.status(status).json({
      success: false,
      message,
      error,
    });

  res.unauthorized = ({ message = "Unauthorized", error = null }: Payload) =>
    res.status(401).json({
      success: false,
      message,
      error,
    });

  res.success = ({
    status = 200,
    message = "Request successful",
    data = null,
    total_count = null,
  }: Payload): Response => {
    const response: Payload = {
      success: true,
      message,
      data,
    };

    if (total_count !== null) {
      response.total_count = total_count;
    }

    return res.status(status).json(response);
  };

  next();
};
