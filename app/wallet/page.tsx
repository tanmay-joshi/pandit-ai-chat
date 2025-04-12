"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CreditCard, PlusCircle, ArrowUpRight, ArrowDownRight, Clock, Wallet, ChevronRight, MessageCircle } from "lucide-react";

interface WalletData {
  balance: number;
  totalCreditsUsed: number;
  recentActivity?: {
    timestamp: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
  }[];
}

export default function WalletPage() {
  const { data: session, status } = useSession();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRechargeModal, setShowRechargeModal] = useState(false);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (status !== "authenticated") return;

      try {
        console.log("Fetching wallet data...");
        const response = await fetch("/api/wallet");
        console.log("API Response status:", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch wallet data");
        }
        const data = await response.json();
        console.log("Received wallet data:", data);
        
        // Process the wallet data from the API response
        const processedData = {
          balance: data.wallet?.balance ?? 0,
          totalCreditsUsed: data.wallet?.transactions?.reduce((total: number, tx: any) => 
            total + (tx.type === 'message_fee' ? Math.abs(tx.amount) : 0), 0) ?? 0,
          recentActivity: data.wallet?.transactions?.map((tx: any) => ({
            timestamp: tx.createdAt,
            type: tx.amount > 0 ? 'credit' : 'debit',
            amount: Math.abs(tx.amount),
            description: tx.description
          })) ?? []
        };
        
        console.log("Processed wallet data:", processedData);
        setWalletData(processedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching wallet data:", err);
        setError("Failed to load wallet data");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      console.log("Session status:", status);
      const timer = setTimeout(() => {
        fetchWalletData();
      }, 500);
      return () => clearTimeout(timer);
    } else if (status === "unauthenticated") {
      console.log("User is not authenticated");
      setLoading(false);
    }
  }, [status]);

  // Use empty wallet data as fallback if server data is not available
  const displayData: WalletData = walletData ?? {
    balance: 0,
    totalCreditsUsed: 0,
    recentActivity: []
  };
  
  console.log("Final display data:", displayData);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center neu-container">
        <Loading size="lg" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 neu-container">
        <div className="neu-card">
          <h1 className="neu-title neu-2xl mb-4">Access Denied</h1>
          <p className="mb-6 neu-text text-muted-foreground">Please sign in to access your wallet</p>
          <Button onClick={() => window.location.href = "/"} className="neu-button neu-button-hover">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden neu-container">
      <header className="px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="neu-title neu-3xl">My Wallet</h1>
          <p className="neu-text text-muted-foreground">
            Manage your credits and view your transactions
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Balance & Quick Actions */}
            <div className="neu-card">
              <div className="flex flex-col items-center">
                <div className="mb-4 relative w-32 h-32 rounded-full overflow-hidden neu-inset flex items-center justify-center">
                  <Wallet className="w-16 h-16 text-primary" />
                </div>
                <h2 className="neu-title neu-2xl mb-2">Current Balance</h2>
                <p className="neu-title neu-3xl text-primary mb-6">{displayData.balance} Credits</p>
                <div className="w-full space-y-4">
                  <Button
                    onClick={() => setShowRechargeModal(true)}
                    className="w-full neu-button neu-button-hover"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add Credits
                  </Button>
                  <Button
                    onClick={() => window.location.href = "/chat/new"}
                    className="w-full neu-button neu-button-hover"
                    disabled={displayData.balance <= 0}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Consultation
                  </Button>
                </div>
              </div>
            </div>

            {/* Credit Usage & Transactions */}
            <div className="md:col-span-2 space-y-6">
              {/* Credit Usage */}
              <div className="neu-card">
                <h2 className="neu-title neu-xl mb-4">Credit Usage</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="neu-inset p-4">
                    <h3 className="neu-text text-sm text-muted-foreground mb-1">Total Credits Used</h3>
                    <p className="neu-title neu-3xl text-primary">{displayData.totalCreditsUsed}</p>
                  </div>
                  <div className="neu-inset p-4">
                    <h3 className="neu-text text-sm text-muted-foreground mb-1">Recent Activity</h3>
                    <p className="neu-title neu-3xl text-primary">
                      {(displayData.recentActivity?.length ?? 0) > 0 ? 'Active' : 'No activity'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Wallet & Transactions */}
              <div className="neu-card">
                <h2 className="neu-title neu-xl mb-4">Recent Transactions</h2>
                <div className="max-h-[40vh] overflow-y-auto pr-2">
                  <div className="space-y-2">
                    {(displayData.recentActivity?.length ?? 0) > 0 ? (
                      displayData.recentActivity?.map((transaction, index) => (
                        <div key={index} className="neu-inset p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-primary/10">
                                {transaction.type === 'credit' ? (
                                  <ArrowUpRight className="w-5 h-5 text-primary" />
                                ) : (
                                  <ArrowDownRight className="w-5 h-5 text-destructive" />
                                )}
                              </div>
                              <div>
                                <h3 className="neu-title">{transaction.description}</h3>
                                <p className="neu-text text-sm text-muted-foreground">
                                  {new Date(transaction.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <span className={`neu-title ${
                              transaction.type === 'credit' ? 'text-primary' : 'text-destructive'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}{transaction.amount} credits
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="neu-inset p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="neu-title">No transactions yet</h3>
                              <p className="neu-text text-sm text-muted-foreground">Add credits to get started</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showRechargeModal} onOpenChange={setShowRechargeModal}>
        <DialogContent className="neu-dialog">
          <DialogHeader>
            <DialogTitle className="neu-title neu-2xl">Add Credits</DialogTitle>
            <DialogDescription className="neu-text text-muted-foreground">
              This feature is coming soon. Please check back later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowRechargeModal(false)} className="neu-button neu-button-hover">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {error && (
        <div className="fixed bottom-4 right-4 neu-error">
          {error}
        </div>
      )}
    </div>
  );
} 