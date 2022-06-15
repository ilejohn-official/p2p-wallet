import { Request, Response } from "express";
import {UserService} from "../services/UserService";
import {getErrorMessage} from "../utils";

const UserController = {

  /**
   *  Retrieve all users
   * @param {Request} _request 
   * @param  {Response} response 
   */
  allUsers: async (_request:Request, response:Response): Promise<void> => {
    try {
      const users = await (new UserService).all();

      response.status(200).json({
        status: 'success',
        message: 'All Users retrieved successfully.',
        data: users
    });
   
    } catch (error) {
      response.status(400).json({status: 'error', message: `Users failed to be retrieved: ${getErrorMessage(error)}`});
    }
  },

   /**
    * Create user
    * 
    * @param {Request} request 
    * @param  {Response} response 
    */
  
  create: async (request:Request, response:Response): Promise<void> => {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;

    try {
     const user = await (new UserService).create(name, email, password);

      response.status(201).json({
        status: 'success',
        message: 'User created successfully.',
        data: user
      });
    } catch (error) {
      response.status(400).json({status: 'error', message: `failed to create user : ${getErrorMessage(error)}`});
    }
  }
  
};

export default UserController;
