import { Response, NextFunction } from "express";
import {CustomRequest} from "../../middlewares";

export default async(request:CustomRequest, response:Response, next:NextFunction) => {
    const amount = request.body.amount;

    if (!amount) {
      return response.status(422).json({status: 'error', message: 'Amount required'});
    }
    
    if(amount < 0) {
      return response.status(422).json({status: 'error', message: 'Invalid amount supplied. Amount must be a positive number'});
    }

    next();
}
