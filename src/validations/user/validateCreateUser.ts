import { Request, Response, NextFunction } from "express";
import {UserService} from "../../services/UserService";
import {validateEmail} from "../../utils";
import {createUserSchema} from "../../validations/validationSchema";

export default async (request:Request, response:Response, next:NextFunction) => {
    if (request.headers.authorization) {
      return response.status(403).json({status: 'error', message: 'logout before you can create user'});
    }

    let { error } = createUserSchema.validate(request.body, { allowUnknown: true, abortEarly: false });

    if (error) {
      return response.status(422).json({status: 'error', message: error.message});
    }
  
    const {email} = request.body;
  
    if(!validateEmail(email)) {
      return response.status(422).json({status: 'error', message: 'Invalid email type supplied'});
    }

    const checkUser = await (new UserService).getUserByEmail(email);

    if (checkUser !== undefined) {
      return response.status(422).json({status: 'error', message: 'Email already exists'});
    }

    next();
}
