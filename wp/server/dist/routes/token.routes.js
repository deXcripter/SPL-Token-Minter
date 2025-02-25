"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const token_controller_1 = require("../controllers/token.controller");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = express_1.default.Router();
router.post("/", multer_1.default.single("image"), token_controller_1.mintToken);
router.route("/:id").get(token_controller_1.gettoken);
router.get("/wallet/:walletId", token_controller_1.getWallettokens);
exports.default = router;
