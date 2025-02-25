"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nft_controller_1 = require("../controllers/nft.controller");
const router = express_1.default.Router();
router.route("/").post(nft_controller_1.mintNft); // create a new NFT
router.route("/:id").get(nft_controller_1.getNft);
router.get("/wallet/:walletId", nft_controller_1.getWalletNfts);
exports.default = router;
