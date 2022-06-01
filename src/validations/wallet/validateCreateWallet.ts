import { Response, NextFunction } from "express";
import {WalletService} from "../../services/WalletService";
import {CustomRequest} from "../../middlewares"
import { User } from "../../services/UserService";

export default async(request:CustomRequest, response:Response, next:NextFunction) => {
    const user = request.user as User
    const handler = new WalletService(user);
    const hasWallet = await handler.hasWallet();

    if (hasWallet.count > 0) {
      return response.status(403).json({status: 'error', message: 'You already have a wallet account.'});
    }

    next();
}
