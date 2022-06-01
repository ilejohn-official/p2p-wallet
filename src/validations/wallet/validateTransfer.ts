import { Response, NextFunction } from "express";
import {CustomRequest} from "../../middlewares";
import { User, UserService } from "../../services/UserService";
import {WalletService} from "../../services/WalletService";
import {validateEmail} from "../../utils";

export default async(request:CustomRequest, response:Response, next:NextFunction) => {
    const amount = request.body.amount;
    const recepientEmail = request.body.email;
    const user = request.user as User;
    

    if (!amount || !recepientEmail) {
      return response.status(422).json({status: 'error', message: 'Amount and recepient email required'});
    }

    if(amount < 0) {
      return response.status(422).json({status: 'error', message: 'Invalid amount supplied. Amount must be a positive number'});
    }

    if(!validateEmail(recepientEmail)) {
      return response.status(422).json({status: 'error', message: 'Invalid Recepient Email'});
    }

    if(user.email === recepientEmail) {
      return response.status(422).json({status: 'error', message: 'Cannot transfer to self'});
    }

    const handler = new WalletService(user);

    const [wallet, recepient, recepientWallet] = await Promise.all([
        handler.getWallet(),
        UserService.getUserByEmail(recepientEmail),
        WalletService.getWalletByEmail(recepientEmail)
    ]);

    if (wallet.available_balance < amount) {
      return response.status(400).json({status: 'error', message: 'Your balance is insufficient for this transfer, please fund your account and try again'});
    }

    if (!recepient) {
      return response.status(400).json({status: 'error', message: 'Recepient is not registered'});
    }

    if(!recepientWallet) {
      return response.status(400).json({status: 'error', message: 'Recepient does not have an account'});
    }

    next();
}
