import {BaseRepository} from "./index";
import db from "../../database/db.connection";
import { TransactionRepository } from "./transaction_repository";
import { IWalletRepository, User, Wallet, WalletCount } from "../global/interfaces";

export class WalletRepository extends BaseRepository implements IWalletRepository {

    static table:string = "wallets";

    constructor() {
      super(WalletRepository.table);
    };

    getWalletByUserId(user_id: User["id"]): Promise<Wallet[]> {
       return this.queryBuilder.where('user_id', user_id);
    }

    async hasWallet(user_id: User["id"]): Promise<WalletCount> {
        return this.queryBuilder.select(db.raw('count(*)')).where('user_id', '=', user_id).first();
    }

    async fundWalletOperation(wallet_id: Wallet["id"], reference: string, amount: number, updateData: any): Promise<void> {
        await db.transaction(async trx => {
            await Promise.all([
              trx(WalletRepository.table).where('id', wallet_id).increment('available_balance', amount),
              trx(TransactionRepository.table).where('wallet_id', wallet_id)
              .whereJsonPath('meta', '$.paystack_reference', '=', reference)
              .update(updateData)
            ])
        });
    }

    async walletTransferOperation(
        walletId: Wallet["id"], 
        senderName: User["name"], 
        recepientWalletId: Wallet["id"], 
        amount: number
    ): Promise<void> {
        await db.transaction(async trx => {
  
            await trx(WalletRepository.table).where('id', walletId).decrement('available_balance', amount).increment('pending_debit_balance', amount);

            const senderTransaction = await trx(TransactionRepository.table).insert({
                wallet_id: walletId,
                type: 'DEBIT',
                debit: amount,
                credit: 0.00,
                narration: 'wallet transfer in process',
                status: 'PENDING'
            }, ['id']);

            const received = await trx(WalletRepository.table).where('id', recepientWalletId).increment('available_balance', amount);

            await trx(TransactionRepository.table).insert({
                wallet_id: recepientWalletId,
                type: 'CREDIT',
                debit: 0.00,
                credit: amount,
                narration: `Your wallet has received a transfer from ${senderName}`,
                status: 'SUCCESS'
            });

            if(received) {
                await trx(WalletRepository.table).where('id', walletId).decrement('pending_debit_balance', amount);

                await trx(TransactionRepository.table).where('id', senderTransaction[0].id).update({
                    narration: 'Wallet transfer successful',
                    status: 'SUCCESS'
                });
            }
           
        });
    }

    public static getWalletsByUserIds(user_ids: User["id"][]): Promise<Wallet[]> {
        return db(WalletRepository.table).whereIn('user_id', user_ids);
    }

};
