import { Response } from "express";
import { User } from "../global/interfaces";
import { CustomRequest } from "../global/types";
import {WalletService} from "../services/WalletService";
import {getErrorMessage} from "../utils";

const UserController = {

  /**
   * 
   * @param {CustomRequest} request 
   * @param {Response} response 
   */
  getWalletBalance: async (request:CustomRequest, response:Response): Promise<void> => {
    const user = request.user as User;

    try {
     const wallet = await (new WalletService(user)).getBalance();

      response.status(201).json({
        status: 'success',
        message: 'Wallet balance retrieved successfully.',
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
  
  create: async (request:CustomRequest, response:Response): Promise<void> => {
    const user = request.user as User;

    try {
     const wallet = await (new WalletService(user)).create();

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
  
    fundWallet: async (request:CustomRequest, response:Response): Promise<void> => {
      const user = request.user as User;

      try {
        const thirdPartyData = await (new WalletService(user)).fundWallet(request.body.amount);
  
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
    completeWalletFunding: async (request:CustomRequest, response:Response): Promise<void> => {
      const user = request.user as User;
      const reference = request.body.reference;

      try {
        const wallet = await (new WalletService(user)).completeWalletFunding(reference);
  
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

  transfer: async (request:CustomRequest, response:Response): Promise<void> => {
    const amount = request.body.amount;
    const user = request.user as User;

    try {
      const recepient = request.recepient as User;

      const wallet = await (new WalletService(user)).transfer(amount, recepient);

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
