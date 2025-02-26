import express from "express";
import {
  gettoken,
  getWallettokens,
  mintToken,
} from "../controllers/token.controller";
import upload from "../middleware/multer";

const router = express.Router();

router.post("/", upload.single("image"), mintToken);
router.route("/:id").get(gettoken);
router.get("/wallet/:walletId", getWallettokens);

export default router;
