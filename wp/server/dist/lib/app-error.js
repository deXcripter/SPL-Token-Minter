"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.message = message;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4")
            ? "Client Error"
            : "Server Error";
        this.isOperational = true;
    }
}
exports.default = AppError;
