import mongoose from "mongoose";
import { INft } from "../@types/nft.types";

const nftSchema = new mongoose.Schema<INft>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },

    nftId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
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

// nftSchema.index({ nftId: 1 });

const Nft = mongoose.model<INft>("Nft", nftSchema);

export default Nft;
