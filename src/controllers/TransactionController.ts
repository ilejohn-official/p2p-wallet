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
    const wallet = await (new WalletService(user)).getWallet();
    const transactions = await (new TransactionService(wallet)).getAll();

      response.status(200).json({
        status: 'success',
        message: 'Transactions retrieved successfully.',
        data: transactions
      });
    } catch (error) {
      response.status(400).json({status: 'error', message: `failed to retrieve transactions : ${getErrorMessage(error)}`});
    }
  },
  
};

export default TransactionController;
