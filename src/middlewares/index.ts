import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import envVariables from "../config";
import { CustomRequest } from "../global/types";
import {getErrorMessage} from "../utils";

const {appKey} = envVariables;

export const authenticateUser = (request:CustomRequest, response:Response, next:NextFunction) => {

    if (!request.headers.authorization) {
      return  response.status(403).json({status: 'error', message: 'unauthorised access'});
    }

    let token = request.headers.authorization.split(" ")[1];
    
    if (!token) {
      return  response.status(403).json({status: 'error', message: 'unauthorised access'});
    }

    try {
      request.user = jwt.verify(token, appKey);

      next();
    } catch (error) {

      return  response.status(403).json({status: 'error', message: getErrorMessage(error)});;
    }
}
