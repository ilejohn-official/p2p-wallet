import express from "express";
import controller from "../controllers/WalletController";
import validateCreateWallet from "../validations/wallet/validateCreateWallet";
import { authenticateUser } from "../middlewares";

const router = express.Router();
const {create} = controller;

router.use(authenticateUser)
router.post("/", validateCreateWallet, create);

export default router;
