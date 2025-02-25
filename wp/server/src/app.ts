import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import nftRoutes from "./routes/nft.routes";
import globalErrorHandler from "./errors";
import { notFound } from "./misc/404-route";

const app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    origin: "*", // FIXME: change the wildcard later
  })
);
app.use(cookieParser());

// rotues
app.use("/api/nft", nftRoutes);
app.use("*", notFound);
app.use(globalErrorHandler);

export default app;
