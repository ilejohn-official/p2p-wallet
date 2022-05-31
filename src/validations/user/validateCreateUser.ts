import { Request, Response, NextFunction } from "express";
import {UserService} from "../../services/UserService";
import {validateEmail} from "../../utils";

export default async (request:Request, response:Response, next:NextFunction) => {
    if (request.headers.authorization) {
      return response.status(403).json({status: 'error', message: 'logout before you can create user'});
    }
  
    const {name, email, password} = request.body;
  
    if (!name || !email || !password) {
      return response.status(422).json({status: 'error', message: 'Name, email and password required'});
    }
  
    if(!validateEmail(email)) {
      return response.status(422).json({status: 'error', message: 'Invalid email type supplied'});
    }

    const checkUser = await UserService.getUserByEmail(email);

    if (checkUser !== undefined) {
      return response.status(422).json({status: 'error', message: 'Email already exists'});
    }

    next();
}
