import mongoose from "mongoose";
import { Itoken } from "../@types/token.types";

const tokenSchema = new mongoose.Schema<Itoken>(
  {
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
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model<Itoken>("Token", tokenSchema);

export default Token;
