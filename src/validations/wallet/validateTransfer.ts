import { Response, NextFunction } from "express";
import {CustomRequest} from "../../middlewares";
import { User, UserService } from "../../services/UserService";
import {WalletService} from "../../services/WalletService";
import {getErrorMessage, validateEmail} from "../../utils";

export default async(request:CustomRequest, response:Response, next:NextFunction) => {
    const amount = request.body.amount;
    const recepientEmail = request.body.email;
    const user = request.user as User;
    

    if (!amount || !recepientEmail) {
      return response.status(422).json({status: 'error', message: 'Amount and recepient email required'});
    }

    if(typeof amount !== 'number' || amount < 0) {
      return response.status(422).json({status: 'error', message: 'Invalid amount supplied. Amount must be a positive number'});
    }

    if(!validateEmail(recepientEmail)) {
      return response.status(422).json({status: 'error', message: 'Invalid Recepient Email'});
    }

    if(user.email === recepientEmail) {
      return response.status(422).json({status: 'error', message: 'Cannot transfer to self'});
    }

    const handler = new WalletService(user);

    try {
      const recepient = await UserService.getUserByEmail(recepientEmail);

      if (!recepient) {
        throw new Error('Recepient is not registered');
      }

      const handle = new WalletService(recepient);

      const [wallet, recepientWallet] = await Promise.all([
        handler.getWallet(),
        handle.getWallet()
      ]);

      if (wallet.available_balance < amount) {
        throw new Error('Your balance is insufficient for this transfer, please fund your account and try again')
      }

      if(!recepientWallet) {
        throw new Error('Recepient does not have an account');
      }
    } catch (error) {
      return response.status(400).json({status: 'error', message: getErrorMessage(error)});
    }

    next();
}
