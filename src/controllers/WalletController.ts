import { Response } from "express";
import { CustomRequest } from "../middlewares";
import { User } from "../services/UserService";
import {WalletService} from "../services/WalletService";
import {getErrorMessage} from "../utils";

const UserController = {

  /**
   * 
   * @param {CustomRequest} request 
   * @param {Response} response 
   */
  getWalletBalance: async (request:CustomRequest, response:Response) => {
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
  },

   /**
    * Create wallet
    * 
    * @param {CustomRequest} request 
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
  },

   /**
     * Fund wallet initiation
     * 
     * @param {CustomRequest} request 
     * @param  {Response} response 
     *
     */
  
    fundWallet: async (request:CustomRequest, response:Response) => {
      const user = request.user as User;

      try {
        const handler = new WalletService(user);
        const thirdPartyData = await handler.fundWallet(request.body.amount);
  
        response.status(302).json({
          status: 'success',
          message: 'Wallet funding initiated.',
          data: thirdPartyData
        });
      } catch (error) {
        response.status(400).json({status: 'error', message: `Failed to initiate wallet funding: ${getErrorMessage(error)}`});
      }
    },

    /**
     * Complete wallet funding
     * @param {CustomRequest} request 
     * @param {Response} response 
     */
    completeWalletFunding: async (request:CustomRequest, response:Response) => {
      const user = request.user as User;
      const reference = request.body.reference;

      try {
        const handler = new WalletService(user);
        const wallet = await handler.completeWalletFunding(reference);
  
        response.status(200).json({
          status: 'success',
          message: 'Wallet funded successfully.',
          data: wallet
        });
      } catch (error) {
        response.status(400).json({status: 'error', message: `Failed to fund wallet: ${getErrorMessage(error)}`});
      }
    },

     /**
     * Transfer to another wallet
     * @param {CustomRequest} request 
     * @param  {Response} response 
     *
     */

  transfer: async (request:CustomRequest, response:Response) => {
    const amount = request.body.amount;
    const recepientEmail = request.body.email;
    const user = request.user as User;

    try {
      const handler = new WalletService(user);
      const wallet = await handler.transfer(amount, recepientEmail);

      response.status(200).json({
        status: 'success',
        message: 'Transfer successful.',
        data: wallet
      });
    } catch (error) {
      response.status(400).json({status: 'error', message: `Failed to transfer: ${getErrorMessage(error)}`});
    }
  },
  
};

export default UserController;
