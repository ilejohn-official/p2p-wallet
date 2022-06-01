import { Response, NextFunction } from "express";
import {CustomRequest} from "../../middlewares";

export default async(request:CustomRequest, response:Response, next:NextFunction) => {
    const reference = request.body.reference;

    if (!reference) {
      return response.status(422).json({status: 'error', message: 'Reference required'});
    }

    next();
}
