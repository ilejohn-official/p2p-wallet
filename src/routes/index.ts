import express, { Request, Response } from "express";
import envVariables from "../config/index";
import userRouter from './users';

const router = express.Router();
const {appName} = envVariables;

router.use('/users', userRouter);

router.get('/', (request: Request, response: Response) => {
 response.send(`${appName} is Online!`);
});

export default router;
