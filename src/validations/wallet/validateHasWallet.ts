import { Response, NextFunction } from "express";
import { User } from "../../global/interfaces";
import { CustomRequest } from "../../global/types";
import {WalletService} from "../../services/WalletService";

export default async (request:CustomRequest, response:Response, next:NextFunction) => {
    const user = request.user as User
    const hasWallet = await ( new WalletService(user)).hasWallet();

    if (hasWallet.count < 1) {
      return response.status(403).json({status: 'error', message: 'You do not have an account, please create one.'});
    }

    next();
}
