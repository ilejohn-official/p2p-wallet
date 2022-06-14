import { Transaction, Wallet } from "../global/interfaces";
import { TransactionRepository } from "../repositories/transaction_repository";

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
