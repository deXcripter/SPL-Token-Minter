"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const nftSchema = new mongoose_1.default.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    nftId: {
        type: Number,
        required: true,
        unique: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    userAddress: {
        required: true,
        type: String,
    },
}, {
    timestamps: true,
});
// nftSchema.index({ nftId: 1 });
const Nft = mongoose_1.default.model("Nft", nftSchema);
exports.default = Nft;
