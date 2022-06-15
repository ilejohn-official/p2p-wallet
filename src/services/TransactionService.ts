import { ITransactionRepository, Transaction, Wallet } from "../global/interfaces";
import { TransactionRepository } from "../repositories/transaction_repository";

export class TransactionService {
  
  private transactionRepository: ITransactionRepository;

  constructor(private wallet: Wallet){
   this.transactionRepository = new TransactionRepository()
  }

  getAll(): Promise<Transaction[]> {
   return this.transactionRepository.getTransactionsByWalletId(this.wallet.id);
  }

  static getOneByRef(reference: string): Promise<Transaction> {
    return TransactionRepository.getTransactionByReference(reference);
  }
}
