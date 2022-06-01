import db from "../../database/db.connection";
import { User, UserService } from "./UserService";

interface Wallet {
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

    static async getWalletByEmail(email: string): Promise<Wallet> {
      const user = await UserService.getUserByEmail(email);

      return db(WalletService.table).where('user_id', user.id).first();
    }

}