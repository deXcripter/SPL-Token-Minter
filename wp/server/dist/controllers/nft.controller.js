"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletNfts = exports.getNft = exports.mintNft = void 0;
const app_error_1 = __importDefault(require("../lib/app-error"));
const async_handler_1 = __importDefault(require("../lib/async-handler"));
const nft_model_1 = __importDefault(require("../models/nft.model"));
exports.mintNft = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, nftId, userAddress, imageUrl } = req.body;
    const payload = {
        name,
        description,
        nftId,
        userAddress,
        imageUrl,
    };
    const nft = new nft_model_1.default(payload);
    yield nft.save({ validateBeforeSave: true });
    res.status(201).json({ status: "success", data: nft });
}));
exports.getNft = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const nft = yield nft_model_1.default.findOne({ nftId: id });
    if (!nft)
        return next(new app_error_1.default(`NFT with ID ${id} not found`, 404));
    res.status(200).json({ status: "success", data: nft });
}));
exports.getWalletNfts = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = req.params.walletId;
    const { page = "1", limit = "50" } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;
    const nfts = yield nft_model_1.default.find({ userAddress: wallet })
        .skip(skip)
        .limit(limitInt);
    const total = yield nft_model_1.default.countDocuments({ userAddress: wallet });
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
}));
