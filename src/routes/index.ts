import express, { Request, Response } from "express";
import envVariables from "../config/index";

const router = express.Router();
const {appName} = envVariables;

router.get('/', (request: Request, response: Response) => {
 response.send(`${appName} is Online!`);
});

export default router;
