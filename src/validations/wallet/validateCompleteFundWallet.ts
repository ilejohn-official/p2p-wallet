import { Response, NextFunction } from "express";
import {CustomRequest} from "../../middlewares";
import db from "../../../database/db.connection";
import { TransactionService } from "../../services/TransactionService";
import {completeWalletFundingSchema} from "../../validations/validationSchema";

export default async(request:CustomRequest, response:Response, next:NextFunction) => {
    let { error } = completeWalletFundingSchema.validate(request.body, { allowUnknown: true, abortEarly: false });

    if (error) {
      return response.status(422).json({status: 'error', message: error.message});
    }

    const transaction = await db(TransactionService.table).whereJsonPath('meta', '$.paystack_reference', '=', request.body.reference).first();

    if (transaction.status === 'SUCCESS') {
      return response.status(400).json({status: 'error', message: 'Transaction completed already'});
    }

    next();
}
