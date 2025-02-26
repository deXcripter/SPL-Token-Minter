class AppError extends Error {
  isOperational: boolean;
  status: string;

  constructor(public message: any, public statusCode: number) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4")
      ? "Client Error"
      : "Server Error";
    this.isOperational = true;
  }
}

export default AppError;
