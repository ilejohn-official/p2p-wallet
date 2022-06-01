import { Response } from "express";
import { CustomRequest } from "../middlewares";
import { User } from "../services/UserService";
import {WalletService} from "../services/WalletService";
import {TransactionService} from "../services/TransactionService";
import {getErrorMessage} from "../utils";

const TransactionController = {

  /**
   * 
   * @param {CustomRequest} request 
   * @param {Response} response 
   */
  getTransactions: async (request:CustomRequest, response:Response) => {
    const user = request.user as User;

    try {
    const handler = new WalletService(user);
    const wallet = await handler.getWallet();
    const handle = new TransactionService(wallet);
    const transactions = await handle.getAll();

      response.status(201).json({
        status: 'success',
        message: 'Transactions retrieved successfully.',
        data: transactions
      });
    } catch (error) {
      response.status(400).json({status: 'error', message: `failed to create wallet : ${getErrorMessage(error)}`});
    }
  },
  
};

export default TransactionController;
