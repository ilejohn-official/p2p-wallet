import { Response, NextFunction } from "express";
import {CustomRequest} from "../../middlewares";
import { User, UserService } from "../../services/UserService";
import {WalletService} from "../../services/WalletService";
import {getErrorMessage, validateEmail} from "../../utils";
import {transferSchema} from "../../validations/validationSchema";

export default async(request:CustomRequest, response:Response, next:NextFunction) => {
    const amount = request.body.amount;
    const recepientEmail = request.body.email;
    const user = request.user as User;
    
    let { error } = transferSchema.validate(request.body, { allowUnknown: true, abortEarly: false });

    if (error) {
      return response.status(422).json({status: 'error', message: error.message});
    }

    if(!validateEmail(recepientEmail)) {
      return response.status(422).json({status: 'error', message: 'Invalid Recepient Email'});
    }

    if(user.email === recepientEmail) {
      return response.status(422).json({status: 'error', message: 'Cannot transfer to self'});
    }

    try {
      const recepient = await (new UserService).getUserByEmail(recepientEmail);

      if (!recepient) {
        throw new Error('Recepient is not registered');
      }

      const [wallet, recepientWallet] = await Promise.all([
        (new WalletService(user)).getWallet(),
        (new WalletService(recepient)).getWallet()
      ]);

      if (wallet.available_balance < amount) {
        throw new Error('Your balance is insufficient for this transfer, please fund your account and try again')
      }

      if(!recepientWallet) {
        throw new Error('Recepient does not have an account');
      }

      request.recepient = recepient;
    } catch (error) {
      return response.status(400).json({status: 'error', message: getErrorMessage(error)});
    }

    next();
}
