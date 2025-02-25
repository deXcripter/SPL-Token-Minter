import { NextFunction, Request, Response } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const message = `Cannot find ${req.originalUrl} on this server!`;
  res.status(404).json({ message });
};
