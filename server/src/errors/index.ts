import { Request, Response, NextFunction } from "express";
import AppError from "../lib/app-error";
import { MongooseError } from "mongoose";
import handleMongooseError from "./mongoose/";

const dev = process.env.NODE_ENV === "development"; // check if the environment is development

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.code === 11000 || err instanceof MongooseError) {
    err = handleMongooseError(err, res);
  }

  return dev
    ? handleDevelopmentErrors(err, res)
    : handleProductionErrors(err, res);
};

const handleProductionErrors = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({ message: err.message });
  } else {
    console.log("ERROR 💥", err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const handleDevelopmentErrors = (err: AppError, res: Response) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    isErrorHandled: err.isOperational || false,
    message: err.message,
    status: err.status,
    statusCode: statusCode,
    err: err,
  });
};

export default globalErrorHandler;
