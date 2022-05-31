import { Request, Response } from "express";
import {UserService} from "../services/UserService";
import {getErrorMessage} from "../utils";

const UserController = {

   /**
     * Create user
     *
     */
  
  create: async (request:Request, response:Response) => {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;

    try {
     const handler = new UserService();
     const user = await handler.create(name, email, password);

      response.status(201).json({
        status: 'success',
        message: 'User created successfully.',
        data: user
      });
    } catch (error) {
     console.log(getErrorMessage(error))
      response.status(400).json({status: 'error', message: `${getErrorMessage(error)}. failed to create user`});
    }
  }
  
};

export default UserController;
