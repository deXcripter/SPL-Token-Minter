import { Request, Response, NextFunction } from "express";
import AppError from "../lib/app-error";
import asyncHandler from "../lib/async-handler";
import Nft from "../models/nft.model";

export const mintNft = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, nftId, userAddress, imageUrl } = req.body;

    const payload = {
      name,
      description,
      nftId,
      userAddress,
      imageUrl,
    };

    const nft = new Nft(payload);
    await nft.save({ validateBeforeSave: true });

    res.status(201).json({ status: "success", data: nft });
  }
);

export const getNft = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const nft = await Nft.findOne({ nftId: id });
    if (!nft) return next(new AppError(`NFT with ID ${id} not found`, 404));

    res.status(200).json({ status: "success", data: nft });
  }
);

export const getWalletNfts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const wallet = req.params.walletId;
    const { page = "1", limit = "50" } = req.query as {
      page: string;
      limit: string;
    };

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    const nfts = await Nft.find({ userAddress: wallet })
      .skip(skip)
      .limit(limitInt);
    const total = await Nft.countDocuments({ userAddress: wallet });

    const totalPages = Math.ceil(total / limitInt);
    const hasNext = pageInt < totalPages;
    const hasPrev = pageInt > 1;

    const pagination = {
      total,
      currentPage: pageInt,
      totalPages,
      hasNext,
      hasPrev,
    };

    return res.status(200).json({ status: "success", data: nfts, pagination });
  }
);
