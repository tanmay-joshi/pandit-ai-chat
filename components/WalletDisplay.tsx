"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type Transaction = {
  id: string;
  amount: number;
  description: string;
  type: string;
  createdAt: string;
};

type Wallet = {
  id: string;
  balance: number;
  transactions: Transaction[];
};

export default function WalletDisplay() {
  const { data: session, status } = useSession();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWallet = async () => {
      if (status !== "authenticated") return;

      try {
        const response = await fetch("/api/wallet");
        if (!response.ok) {
          throw new Error("Failed to fetch wallet");
        }
        const data = await response.json();
        setWallet(data.wallet);
        setLoading(false);
      } catch (err) {
        setError("Failed to load wallet information");
        setLoading(false);
        console.error("Error fetching wallet:", err);
      }
    };

    fetchWallet();
  }, [status]);

  if (status !== "authenticated") {
    return null;
  }

  if (loading) {
    return <div className="text-center p-4">Loading wallet...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!wallet) {
    return <div className="text-center p-4">No wallet information available</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Wallet</h2>
        <div className="flex items-center">
          <span className="mr-2">Balance:</span>
          <span className={`font-bold text-xl ${wallet.balance < 20 ? 'text-red-500' : 'text-green-600'}`}>
            {wallet.balance} credits
          </span>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Recent Transactions</h3>
        {wallet.transactions?.length > 0 ? (
          <div className="max-h-40 overflow-y-auto">
            {wallet.transactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between py-1 border-b">
                <div className="flex-1">
                  <p className="text-sm">{transaction.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`ml-2 font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent transactions</p>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Each AI response costs 10 credits. Your messages are free.</p>
      </div>
    </div>
  );
} 