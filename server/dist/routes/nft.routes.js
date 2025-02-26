"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const token_controller_1 = require("../controllers/token.controller");
const router = express_1.default.Router();
router.post("/", token_controller_1.minttoken);
router.route("/:id").get(token_controller_1.gettoken);
router.get("/wallet/:walletId", token_controller_1.getWallettokens);
exports.default = router;
