import { Response } from "express";
import AppError from "../../lib/app-error";

export default function HandleMongooseValidationError(
  err: any,
  res: Response
): AppError {
  // Handling duplicate key errors (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]; // Get the duplicate field
    const value = err.keyValue[field]; // Get the duplicate value
    const message = `Duplicate value '${value}' for field '${field}'. Please use a unique value.`;
    return new AppError(message, 409);
  }

  // Handling validation errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
    return new AppError(message, 400);
  }

  // Handling cast errors
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
  }

  return new AppError("Uncaught DB Error", 500);
}
