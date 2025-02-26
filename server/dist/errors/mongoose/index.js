"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HandleMongooseValidationError;
const app_error_1 = __importDefault(require("../../lib/app-error"));
function HandleMongooseValidationError(err, res) {
    // Handling duplicate key errors (E11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0]; // Get the duplicate field
        const value = err.keyValue[field]; // Get the duplicate value
        const message = `Duplicate value '${value}' for field '${field}'. Please use a unique value.`;
        return new app_error_1.default(message, 409);
    }
    // Handling validation errors
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        return new app_error_1.default(message, 400);
    }
    // Handling cast errors
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}: ${err.value}`;
        return new app_error_1.default(message, 400);
    }
    return new app_error_1.default("Uncaught DB Error", 500);
}
