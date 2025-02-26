import express from "express";
import {
  getToken,
  getWallettokens,
  mintToken,
} from "../controllers/token.controller";
import upload from "../middleware/multer";

const router = express.Router();

router.post("/", upload.single("image"), mintToken);
router.route("/:id").get(getToken);
router.get("/wallet/:walletId", getWallettokens);

export default router;
