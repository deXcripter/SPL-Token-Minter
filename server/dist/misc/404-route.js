"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (req, res, next) => {
    const message = `Cannot find ${req.originalUrl} on this server!`;
    res.status(404).json({ message });
};
exports.notFound = notFound;
