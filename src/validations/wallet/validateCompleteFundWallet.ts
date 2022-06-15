import { Response, NextFunction } from "express";
import { CustomRequest } from "../../global/types";
import { TransactionService } from "../../services/TransactionService";
import {completeWalletFundingSchema} from "../../validations/validationSchema";

export default async(request:CustomRequest, response:Response, next:NextFunction) => {
    let { error } = completeWalletFundingSchema.validate(request.body, { allowUnknown: true, abortEarly: false });

    if (error) {
      return response.status(422).json({status: 'error', message: error.message});
    }

    const transaction = await TransactionService.getOneByRef(request.body.reference);
    
    if (transaction.status === 'SUCCESS') {
      return response.status(400).json({status: 'error', message: 'Transaction completed already'});
    }

    next();
}
