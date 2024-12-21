export class CustomError extends Error {
  status: number;
  message: string;
  err_message: string;

  constructor(status: number, message: string, err_message: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.err_message = err_message;
  }
}
