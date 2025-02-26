"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tokenSchema = new mongoose_1.default.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    maxSupply: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    mintAddress: {
        type: String,
        required: true,
    },
    ticker: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const Token = mongoose_1.default.model("Token", tokenSchema);
exports.default = Token;
