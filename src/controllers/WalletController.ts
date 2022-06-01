import { Response } from "express";
import { CustomRequest } from "../middlewares";
import { User } from "../services/UserService";
import {WalletService} from "../services/WalletService";
import {getErrorMessage} from "../utils";

const UserController = {

   /**
    * Create wallet
    * 
    * @param {Request} request 
    * @param  {Response} response 
    */
  
  create: async (request:CustomRequest, response:Response) => {
    const user = request.user as User;

    try {
     const handler = new WalletService(user);
     const wallet = await handler.create();

      response.status(201).json({
        status: 'success',
        message: 'Wallet created successfully.',
        data: wallet
      });
    } catch (error) {
      response.status(400).json({status: 'error', message: `failed to create wallet : ${getErrorMessage(error)}`});
    }
  }
  
};

export default UserController;
