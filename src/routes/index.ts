import express, { Request, Response } from "express";
import envVariables from "../config/index";
import userRouter from './users';
import authRouter from './auth';
import walletRouter from './wallets';
import transactionRouter from './transactions';

const router = express.Router();
const {appName} = envVariables;

router.use(authRouter);
router.use('/users', userRouter);
router.use('/wallets', walletRouter);
router.use('/transactions', transactionRouter);

router.get('/', (request: Request, response: Response) => {
 response.send(`${appName} is Online!`);
});

export default router;
