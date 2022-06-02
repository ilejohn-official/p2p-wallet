import { Response, NextFunction } from "express";
import {CustomRequest} from "../../middlewares";
import db from "../../../database/db.connection";
import { TransactionService } from "../../services/TransactionService";

export default async(request:CustomRequest, response:Response, next:NextFunction) => {
    const reference = request.body.reference;

    if (!reference) {
      return response.status(422).json({status: 'error', message: 'Reference required'});
    }

    const transaction = await db(TransactionService.table).whereJsonPath('meta', '$.paystack_reference', '=', reference).first();

    if (transaction.status === 'SUCCESS') {
      return response.status(400).json({status: 'error', message: 'Transaction completed already'});
    }

    next();
}
