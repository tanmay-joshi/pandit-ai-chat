export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  description: string;
  type: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  transactions: Transaction[];
} 