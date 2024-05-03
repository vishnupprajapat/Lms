class ErrorHandler extends Error {
  status: Number;
  constructor(message: string, status: Number) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
