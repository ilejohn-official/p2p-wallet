import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import envVariables from "../config";
import { User } from "../services/UserService";
import {getErrorMessage} from "../utils";

const {appKey} = envVariables;

export type CustomRequest = Request & { user?: User | JwtPayload | string, recepient?: User}

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
