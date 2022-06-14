import { Response, NextFunction } from "express";
import { CustomRequest } from "../../global/types";
import {fundWalletSchema} from "../../validations/validationSchema";

export default async (request:CustomRequest, response:Response, next:NextFunction) => {
    let { error } = fundWalletSchema.validate(request.body, { allowUnknown: true, abortEarly: false });

    if (error) {
      return response.status(422).json({status: 'error', message: error.message});
    }

    next();
}
