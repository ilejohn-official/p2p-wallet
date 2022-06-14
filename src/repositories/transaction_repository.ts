import { Transaction, Wallet } from "../global/interfaces";
import {BaseRepository} from "./index";

export class TransactionRepository extends BaseRepository {

    static table:string = "transactions";

    constructor() {
        super(TransactionRepository.table);
    };

    async getTransactionsByWalletId(wallet_id:Wallet["id"]): Promise<Transaction[]>{
      return this.queryBuilder
        .select('id', 'wallet_id', 'type', 'debit', 'credit', 'narration', 'status', 'createdAt', 'updatedAt')
        .where('wallet_id', wallet_id)
        .orderBy('updatedAt', 'desc');
    }

    async updateByRefAndWalletId(data: any, wallet_id: Wallet["id"], reference: string): Promise<void> {
        this.queryBuilder.where('wallet_id', wallet_id)
            .whereJsonPath('meta', '$.paystack_reference', '=', reference)
            .update(data);
    }

};
