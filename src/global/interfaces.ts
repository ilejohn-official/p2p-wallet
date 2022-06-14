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

