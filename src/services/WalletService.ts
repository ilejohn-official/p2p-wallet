import db from "../../database/db.connection";
import { WalletRepository } from "../repositories/wallet_repository";
import { TransactionRepository } from "../repositories/transaction_repository";
import {getErrorMessage, payViaPaystack, verifyPaystackPayment} from "../utils";
import { User, Wallet, WalletCount } from "../global/interfaces";

export class WalletService {

    static table:string = "wallets";
    user: User;

    private walletRepository: WalletRepository;

    constructor(user: User){
     this.walletRepository = new WalletRepository();
     this.user = user;
    }

    async getBalance(): Promise<Partial<Wallet>> {
      const [wallet] = await this.walletRepository.getWalletByUserId(this.user.id);

      const {pending_debit_balance, pending_credit_balance, ...walletBalance} = wallet

      return walletBalance
    }

    async create(): Promise<Wallet> {

      const [wallet] = await this.walletRepository.create({user_id: this.user.id},[
        'id', 'user_id', 'available_balance', 'pending_debit_balance', 'pending_credit_balance'
      ]);

      return wallet;
    }

    async hasWallet() : Promise<WalletCount> {
      return this.walletRepository.hasWallet(this.user.id);

    }

    async getWallet() : Promise<Wallet>{
      const [wallet] = await this.walletRepository.getWalletByUserId(this.user.id);
      return wallet;
    }

    async fundWallet(amount: number) : Promise<Wallet> {
      const wallet = await this.getWallet();

      try {
        const initPayment = await payViaPaystack(this.user.email, amount);

        await (new TransactionRepository).create({
          wallet_id: wallet.id,
          type: 'CREDIT',
          debit: 0.00,
          credit: amount,
          narration: 'wallet funding initiated',
          status: 'PENDING',
          meta: JSON.stringify({
            init_data: initPayment.data,
            final_data: null,
            email: this.user.email,
            amount: amount,
            paystack_reference: initPayment.data.reference
          })
        });

        return initPayment.data;
      } catch (error) {
        
        throw new Error(`wallet funding initialisation failed: ${getErrorMessage(error)}.`); 
      }
    }

    async completeWalletFunding (reference: string) {
      const wallet = await this.getWallet();
      const response = await verifyPaystackPayment(reference);

      if (!response.status) {
        await (new TransactionRepository).updateByRefAndWalletId({
            narration: `Payment Unsuccessful: ${response.message}`,
            status: 'FAILED'
         }, wallet.id, reference);

        throw new Error(response.message);
      }

      if (response.data.status !== "success") {
        await (new TransactionRepository).updateByRefAndWalletId({
          narration: `Payment Unsuccessful:  ${response.data.message || response.data.gateway_response}`,
          status: 'FAILED',
          meta: db.jsonSet('meta', '$.final_data', JSON.stringify(response.data) )
        }, wallet.id, reference);

        throw new Error(response.data.message || response.data.gateway_response);
      }

      const amount = (response.data.amount/100);

      try {
        await this.walletRepository.fundWalletOperation(wallet.id, reference, amount, {
          narration: `Payment successful: ${response.data.message || response.data.gateway_response}`,
          status: 'SUCCESS',
          credit: amount,
          meta: db.jsonSet('meta', '$.final_data', JSON.stringify(response.data))
        });

        return this.getWallet();
      } catch (error) {
        throw new Error(`wallet funding failed: ${getErrorMessage(error)}.`); 
      }
    }

    async transfer(amount: number, recepient: User) {
      const [wallet, recepientWallet] = await WalletRepository.getWalletsByUserIds([this.user.id, recepient.id]);
  
      try {
          await this.walletRepository.walletTransferOperation(wallet.id, this.user.name, recepientWallet.id, amount)
  
          return await this.getWallet();
        } catch (error) {
  
          await (new TransactionRepository).create({
            wallet_id: wallet.id,
            type: 'DEBIT',
            debit: amount,
            credit: 0.00,
            narration: 'Wallet transfer failed, try again later',
            status: 'FAILED'
         });
  
          throw new Error(`Wallet transfer failed: ${getErrorMessage(error)}`); 
        }
    }

}
