"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tokenSchema = new mongoose_1.default.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tokenId: {
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
  },
  {
    timestamps: true,
  }
);
// tokenSchema.index({ tokenId: 1 });
const token = mongoose_1.default.model("token", tokenSchema);
exports.default = token;
