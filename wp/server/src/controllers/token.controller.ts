import { Request, Response, NextFunction } from "express";
import AppError from "../lib/app-error";
import asyncHandler from "../lib/async-handler";
import Token from "../models/token.model";
import { uploadImage } from "../lib/image-handler";

const FOLDER = "token";

export const mintToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, ticker, maxSupply, address } = req.body;

    if (!req.file) return next(new AppError("Please upload an image", 400));

    const payload = {
      name,
      ticker,
      maxSupply,
      address,
    };

    const token = new Token(payload);

    const link = await uploadImage(req, FOLDER);
    if (link instanceof AppError) return next(link);
    token.imageUrl = link;

    await token.save({ validateBeforeSave: true });

    res.status(201).json({ status: "success", data: token });
  }
);

export const gettoken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const token = await Token.findOne({ tokenId: id });
    if (!token) return next(new AppError(`token with ID ${id} not found`, 404));

    res.status(200).json({ status: "success", data: token });
  }
);

export const getWallettokens = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const wallet = req.params.walletId;
    const { page = "1", limit = "50" } = req.query as {
      page: string;
      limit: string;
    };

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    const tokens = await Token.find({ address: wallet })
      .skip(skip)
      .limit(limitInt);
    const total = await Token.countDocuments({ address: wallet });

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

    return res
      .status(200)
      .json({ status: "success", data: tokens, pagination });
  }
);
