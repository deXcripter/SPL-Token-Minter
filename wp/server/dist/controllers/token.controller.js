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
exports.getWallettokens = exports.gettoken = exports.mintToken = void 0;
const app_error_1 = __importDefault(require("../lib/app-error"));
const async_handler_1 = __importDefault(require("../lib/async-handler"));
const token_model_1 = __importDefault(require("../models/token.model"));
const image_handler_1 = require("../lib/image-handler");
const FOLDER = "token";
exports.mintToken = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ticker, maxSupply, address } = req.body;
    if (!req.file)
        return next(new app_error_1.default("Please upload an image", 400));
    const payload = {
        name,
        ticker,
        maxSupply,
        address,
    };
    const token = new token_model_1.default(payload);
    const link = yield (0, image_handler_1.uploadImage)(req, FOLDER);
    if (link instanceof app_error_1.default)
        return next(link);
    token.imageUrl = link;
    yield token.save({ validateBeforeSave: true });
    res.status(201).json({ status: "success", data: token });
}));
exports.gettoken = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const token = yield token_model_1.default.findOne({ tokenId: id });
    if (!token)
        return next(new app_error_1.default(`token with ID ${id} not found`, 404));
    res.status(200).json({ status: "success", data: token });
}));
exports.getWallettokens = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = req.params.walletId;
    const { page = "1", limit = "50" } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;
    const tokens = yield token_model_1.default.find({ address: wallet })
        .skip(skip)
        .limit(limitInt);
    const total = yield token_model_1.default.countDocuments({ address: wallet });
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
}));
