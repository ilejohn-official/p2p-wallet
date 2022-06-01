import db from "../../database/db.connection";
import { User, UserService } from "./UserService";
import { TransactionService } from "./TransactionService";
import {getErrorMessage, payViaPaystack, verifyPaystackPayment} from "../utils"

export interface Wallet {
    id: number,
    user_id: User["id"],
    available_balance: number,
    pending_debit_balance: number,
    pending_credit_balance: number,
    createdAt: Date,
    updatedAt: Date
}
interface WalletCount {
 count: number | string;
}

export class WalletService {

    static table:string = "wallets";
    user: User;

    constructor(user: User){
     this.user = user;
    }

    async getBalance(): Promise<Partial<Wallet>> {
      const wallet = await WalletService.getWalletByEmail(this.user.email);

      const {pending_debit_balance, pending_credit_balance, ...walletBalance} = wallet

      return walletBalance
    }

    async create(): Promise<Wallet> {

      const wallets = await db(WalletService.table).insert({user_id: this.user.id}, [
          'id', 'user_id', 'available_balance', 'pending_debit_balance', 'pending_credit_balance'
      ]);

      return wallets[0];
    }

    async hasWallet() : Promise<WalletCount> {
        return db(WalletService.table).select(db.raw('count(*)'))
        .where('user_id', '=', this.user.id).first();
    }

    async getWallet() : Promise<Wallet>{
      return db(WalletService.table).where('user_id', this.user.id).first();
    }

    async fundWallet(amount: number) : Promise<Wallet> {
      const wallet = await this.getWallet();

      try {
        const initPayment = await payViaPaystack(this.user.email, amount);

        db(TransactionService.table).insert({
          wallet_id: wallet.id,
          type: 'CREDIT',
          debit: 0.00,
          credit: amount,
          narration: 'wallet funding initiated',
          status: 'PENDING',
          meta: {
            initial_attempt: initPayment.data,
            email: this.user.email,
            amount: amount,
            paystack_reference: initPayment.data.reference
          }
        });

        return initPayment.data;
      } catch (error) {
        
        throw new Error(`wallet funding initialisation failed: ${getErrorMessage(error)}.`); 
      }
    }

    async completeWalletFunding (reference: string) {
      const response = await verifyPaystackPayment(reference);

      if (response.statusCode !== 200) {
        await db(TransactionService.table).where('email', this.user.email)
        .whereRaw('?? \\? ?', ['meta->paystack_reference', reference])
        .update({
          narration: 'Payment unsuccessful',
          status: 'FAILED',
          meta: {
            paystack_reference: reference,
            message: response.message
          }
        });

        return
      }

      if (response.data.status !== "success") {
        await db(TransactionService.table).where('email', this.user.email)
        .whereRaw('?? \\? ?', ['meta->paystack_reference', reference])
        .update({
          narration: 'Payment unsuccessful',
          status: 'FAILED',
          meta: {
            paystack_reference: reference,
            message: response.message,
            data: response.data
          }
        });

        return
      }

      const wallet = await this.getWallet();
      const amount = response.data.amount / 100;

      try {
        await db.transaction(async trx => {

          await Promise.all([
            trx(WalletService.table).where('id', wallet.id).increment('available_balance', amount),
            trx(TransactionService.table).where('email', this.user.email)
            .whereRaw('?? \\? ?', ['meta->paystack_reference', reference])
            .update({
              narration: 'Payment successful',
              status: 'SUCCESS',
              credit: amount,
              meta: {
                paystack_reference: reference,
                message: response.message,
                data: response.data
              }
            })
          ])
           
        });

        return this.getWallet();
      } catch (error) {
        
        throw new Error(`wallet funding failed: ${getErrorMessage(error)}.`); 
      }
    }

    async transfer(amount: number, recepientEmail: string) {
      const wallet = await this.getWallet();
  
      const recepientWallet = await WalletService.getWalletByEmail(recepientEmail);
  
      try {
          await db.transaction(async trx => {
  
              await trx(WalletService.table).where('id', wallet.id).decrement('available_balance', amount).increment('pending_debit_balance', amount);
  
              const senderTransaction = await trx(TransactionService.table).insert({
                  wallet_id: wallet.id,
                  type: 'DEBIT',
                  debit: amount,
                  credit: 0.00,
                  narration: 'wallet transfer in process',
                  status: 'PENDING'
              }, ['id']);
  
              const received = await trx(WalletService.table).where('id', recepientWallet.id).increment('available_balance', amount);
  
              await trx(TransactionService.table).insert({
                  wallet_id: recepientWallet.id,
                  type: 'CREDIT',
                  debit: 0.00,
                  credit: amount,
                  narration: `Your wallet has received a transfer from ${this.user.name}`,
                  status: 'SUCCESS'
              });
  
              if(received) {
                  await trx(WalletService.table).where('id', wallet.id).decrement('pending_debit_balance', amount);
  
                  await trx(TransactionService.table).where('id', senderTransaction[0].id).update({
                      narration: 'Wallet transfer successful',
                      status: 'SUCCESS'
                  });
              }
             
          });
  
          return this.getWallet();
        } catch (error) {
  
          await db(TransactionService.table).insert({
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

    static async getWalletByEmail(email: string): Promise<Wallet> {
        const user = await UserService.getUserByEmail(email);
        
        return db(WalletService.table).where('user_id', user.id).first();
    }

}