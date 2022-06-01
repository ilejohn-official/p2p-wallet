import express from "express";
import controller from "../controllers/WalletController";
import validateCreateWallet from "../validations/wallet/validateCreateWallet";
import validateHasWallet from "../validations/wallet/validateHasWallet";
import validateFundWallet from "../validations/wallet/validateFundWallet";
import validateTransfer from "../validations/wallet/validateTransfer";
import validateCompleteFundWallet from "../validations/wallet/validateCompleteFundWallet";
import { authenticateUser } from "../middlewares";

const router = express.Router();
const {create, fundWallet, transfer, getWalletBalance, completeWalletFunding} = controller;

router.use(authenticateUser);
router.post("/", validateCreateWallet, create);
router.use(validateHasWallet);
router.get("/balance", getWalletBalance);
router.post("/fund", validateFundWallet, fundWallet);
router.post("/complete-funding", validateCompleteFundWallet, completeWalletFunding);
router.post("/transfer", validateTransfer, transfer);

export default router;
