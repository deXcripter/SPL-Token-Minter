import express from "express";
import { getNft, getWalletNfts, mintNft } from "../controllers/nft.controller";

const router = express.Router();

router.post("/", mintNft);
router.route("/:id").get(getNft);
router.get("/wallet/:walletId", getWalletNfts);

export default router;
