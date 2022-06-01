import db from "../../database/db.connection";
import {Wallet} from "../services/WalletService"

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

    constructor(wallet: Wallet){
     this.wallet = wallet;
    }

    getAll() {
     return db(TransactionService.table).where('wallet_id', this.wallet.id);  
    }

}
