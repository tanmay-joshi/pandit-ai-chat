"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WalletDisplay from "@/components/WalletDisplay";
import { CreditCard, PlusCircle } from "lucide-react";

export default function WalletPage() {
  const { status } = useSession();
  const [showRechargeModal, setShowRechargeModal] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading wallet...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">Please sign in to view your wallet</p>
          <Button onClick={() => window.location.href = "/"}>Go to Homepage</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Wallet</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance & Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="p-6 mb-6">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <Button 
                className="mb-3 w-full"
                onClick={() => setShowRechargeModal(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Credits
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open("/chat/new", "_self")}
              >
                New Consultation
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Credit Usage</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>AI Response</span>
                <span className="font-semibold">10 credits</span>
              </div>
              <div className="flex justify-between">
                <span>Your Message</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Kundali Analysis</span>
                <span className="font-semibold">15 credits</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <p className="text-gray-600">
                  Get more insights with additional credits. 
                  Recharge your wallet for uninterrupted consultations.
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Wallet display with transactions */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Wallet & Transactions</h2>
            <WalletDisplay />
            
            {/* Extended transaction history */}
            <div className="mt-6">
              <h3 className="font-medium mb-3">Transaction History</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b grid grid-cols-12 font-medium text-sm">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-3">Date</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {/* Transaction rows will be populated by WalletDisplay component */}
                  <div className="p-4 text-center text-gray-500 text-sm italic">
                    The transaction history shows your recent credit usage and purchases.
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Recharge Modal Placeholder */}
      {showRechargeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add Credits</h2>
            <p className="mb-4">Credits are coming soon! This feature is under development.</p>
            <div className="flex justify-between space-x-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowRechargeModal(false)}
              >
                Close
              </Button>
              <Button className="w-full" disabled>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 