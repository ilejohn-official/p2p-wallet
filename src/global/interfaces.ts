import { Knex } from "knex";

interface Timestamp {
  updatedAt: string,
  createdAt: string
}

export interface User extends Timestamp {
    name: string,
    email: string,
    id: number
}

export interface Wallet  extends Timestamp {
    id: number,
    user_id: User["id"],
    available_balance: number,
    pending_debit_balance: number,
    pending_credit_balance: number
}

export interface WalletCount {
 count: number | string;
}

export interface Transaction extends Timestamp {
    id: number,
    wallet_id: Wallet["id"],
    type: "CREDIT" | "DEBIT",
    debit: number,
    credit: number,
    narration: string,
    status: "SUCCESS" | "FAILED" | "PENDING",
    meta?: JSON | string | null
}

export interface ITransactionRepository extends IBaseRepository {
    getTransactionsByWalletId(wallet_id:Wallet["id"]): Promise<Transaction[]>,
    updateByRefAndWalletId(data: any, wallet_id: Wallet["id"], reference: string): Promise<void>
}

export interface IUserRepository extends IBaseRepository {
    getUserByEmail(email: string): Promise<User>
}

export interface IWalletRepository extends IBaseRepository {
    getWalletByUserId(user_id: User["id"]): Promise<Wallet[]>,
    hasWallet(user_id: User["id"]): Promise<WalletCount>,
    fundWalletOperation(wallet_id: Wallet["id"], reference: string, amount: number, updateData: any): Promise<void>,
    walletTransferOperation(
        walletId: Wallet["id"], 
        senderName: User["name"], 
        recepientWalletId: Wallet["id"], 
        amount: number
    ): Promise<void>
}

export interface IBaseRepository {
    all(): Knex.QueryBuilder ,
    create(data: any, returning: string[], options?: any): Knex.QueryBuilder
}
