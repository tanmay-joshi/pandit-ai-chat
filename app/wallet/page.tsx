"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import WalletDisplay from "@/components/WalletDisplay";
import { CreditCard, PlusCircle, ArrowUpRight, ArrowDownRight, Clock, Wallet, ChevronRight } from "lucide-react";

export default function WalletPage() {
  const { status } = useSession();
  const [showRechargeModal, setShowRechargeModal] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="rounded-2xl bg-[#F8F7F4] p-8 text-center border-[0.1rem] border-[#212121] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1),0_-1px_2px_-2px_rgba(0,0,0,0.1)]">
          <h1 className="text-2xl font-libre-bold mb-4">Access Denied</h1>
          <p className="mb-6 font-libre-regular text-muted-foreground">Please sign in to view your wallet</p>
          <Button onClick={() => window.location.href = "/"} className="font-libre-regular">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-libre-bold mb-4">My Wallet</h1>
      <p className="text-muted-foreground font-libre-regular mb-8">
        Manage your credits and view transaction history
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Balance Card */}
          <div className="group relative rounded-2xl bg-[#F8F7F4] p-6 border-[0.1rem] border-[#212121] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1),0_-1px_2px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-white/20 before:backdrop-blur-[2px] after:absolute after:inset-0 after:-z-20 after:rounded-[inherit] after:bg-gradient-to-b after:from-white/80 after:to-white/20">
            <div className="flex flex-col">
              <h2 className="text-xl font-libre-bold mb-4">Quick Actions</h2>
              <Button 
                className="mb-3 w-full font-libre-regular"
                onClick={() => setShowRechargeModal(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Credits
              </Button>
              <Button 
                variant="outline" 
                className="w-full font-libre-regular"
                onClick={() => window.location.href = "/chat/new"}
              >
                New Consultation
              </Button>
            </div>
          </div>

          {/* Credit Usage Card */}
          <div className="group relative rounded-2xl bg-[#F8F7F4] p-6 border-[0.1rem] border-[#212121] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1),0_-1px_2px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-white/20 before:backdrop-blur-[2px] after:absolute after:inset-0 after:-z-20 after:rounded-[inherit] after:bg-gradient-to-b after:from-white/80 after:to-white/20">
            <h2 className="text-xl font-libre-bold mb-4">Credit Usage</h2>
            <div className="space-y-3 font-libre-regular">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 border-[0.1rem] border-[#212121]/10">
                <span className="text-muted-foreground">AI Response</span>
                <span className="font-libre-bold">10 credits</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 border-[0.1rem] border-[#212121]/10">
                <span className="text-muted-foreground">Your Message</span>
                <span className="font-libre-bold text-primary">Free</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 border-[0.1rem] border-[#212121]/10">
                <span className="text-muted-foreground">Kundali Analysis</span>
                <span className="font-libre-bold">15 credits</span>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-white/50 border-[0.1rem] border-[#212121]/10">
                <p className="text-sm text-muted-foreground">
                  Get more insights with additional credits. 
                  Recharge your wallet for uninterrupted consultations.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wallet display with transactions */}
        <div className="lg:col-span-2">
          <div className="group relative rounded-2xl bg-[#F8F7F4] p-6 border-[0.1rem] border-[#212121] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1),0_-1px_2px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-white/20 before:backdrop-blur-[2px] after:absolute after:inset-0 after:-z-20 after:rounded-[inherit] after:bg-gradient-to-b after:from-white/80 after:to-white/20">
            <h2 className="text-xl font-libre-bold mb-6">Wallet & Transactions</h2>
            
            {/* Current Balance */}
            <div className="mb-8 p-6 rounded-xl bg-white/50 border-[0.1rem] border-[#212121]/10">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-5 h-5 text-primary" />
                <h3 className="font-libre-bold text-lg">Current Balance</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-libre-bold text-primary">500</span>
                <span className="text-lg font-libre-regular text-muted-foreground">credits</span>
              </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-libre-bold text-lg">Recent Transactions</h3>
                <Button variant="ghost" size="sm" className="font-libre-regular text-primary">
                  View All
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {/* Transaction Item */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 border-[0.1rem] border-[#212121]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                      <ArrowUpRight className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-libre-bold">Recharge</h4>
                      <p className="text-sm text-muted-foreground font-libre-regular">
                        <Clock className="w-4 h-4 inline mr-1" />
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <span className="font-libre-bold text-primary">+100 credits</span>
                </div>

                {/* Transaction Item */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 border-[0.1rem] border-[#212121]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-destructive/10">
                      <ArrowDownRight className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <h4 className="font-libre-bold">AI Consultation</h4>
                      <p className="text-sm text-muted-foreground font-libre-regular">
                        <Clock className="w-4 h-4 inline mr-1" />
                        5 hours ago
                      </p>
                    </div>
                  </div>
                  <span className="font-libre-bold text-destructive">-10 credits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recharge Modal */}
      <Dialog open={showRechargeModal} onOpenChange={setShowRechargeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-libre-bold">Add Credits</DialogTitle>
            <DialogDescription className="font-libre-regular">
              Credits are coming soon! This feature is under development.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              className="font-libre-regular"
              onClick={() => setShowRechargeModal(false)}
            >
              Close
            </Button>
            <Button className="font-libre-regular" disabled>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 