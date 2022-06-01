import express, { Request, Response } from "express";
import envVariables from "../config/index";
import userRouter from './users';
import authRouter from './auth';
import walletRouter from './wallets';

const router = express.Router();
const {appName} = envVariables;

router.use(authRouter);
router.use('/users', userRouter);
router.use('/wallets', walletRouter);

router.get('/', (request: Request, response: Response) => {
 response.send(`${appName} is Online!`);
});

export default router;
