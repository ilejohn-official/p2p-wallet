import db from "../../database/db.connection";
import { TransactionRepository } from "../repositories/transaction_repository";
import {Wallet} from "../services/WalletService";

export interface Transaction {
    id: number,
    wallet_id: Wallet["id"],
    type: "CREDIT" | "DEBIT",
    debit: number,
    credit: number,
    narration: string,
    status: "SUCCESS" | "FAILED" | "PENDING",
    meta?: JSON | string | null,
    updatedAt: string,
    createdAt: string
}

export class TransactionService {

    static table:string = "transactions";
    wallet: Wallet;
    
    private transactionRepository: TransactionRepository;

    constructor(wallet: Wallet){
     this.transactionRepository = new TransactionRepository()
     this.wallet = wallet;
    }

    getAll(): Promise<Transaction[]> {
     return this.transactionRepository.getTransactionsByWalletId(this.wallet.id);
    }

}
