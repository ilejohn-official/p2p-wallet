import express from "express";
import controller from "../controllers/TransactionController";
import validateHasWallet from "../validations/wallet/validateHasWallet";
import { authenticateUser } from "../middlewares";

const router = express.Router();
const { getTransactions} = controller;

router.use(authenticateUser, validateHasWallet);
router.get("/", getTransactions);

export default router;
