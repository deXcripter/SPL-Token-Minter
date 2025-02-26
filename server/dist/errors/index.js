"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("./mongoose/"));
const dev = process.env.NODE_ENV === "development"; // check if the environment is development
const globalErrorHandler = (err, req, res, next) => {
    if (err.code === 11000 || err instanceof mongoose_1.MongooseError) {
        err = (0, mongoose_2.default)(err, res);
    }
    return dev
        ? handleDevelopmentErrors(err, res)
        : handleProductionErrors(err, res);
};
const handleProductionErrors = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
    else {
        console.log("ERROR 💥", err);
        res.status(500).json({ message: "Something went wrong!" });
    }
};
const handleDevelopmentErrors = (err, res) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        isErrorHandled: err.isOperational || false,
        message: err.message,
        status: err.status,
        statusCode: statusCode,
        err: err,
    });
};
exports.default = globalErrorHandler;
