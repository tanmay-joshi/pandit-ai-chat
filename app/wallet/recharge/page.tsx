"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import WalletDisplay from "@/components/WalletDisplay";

export default function WalletRechargePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [amount, setAmount] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // In a real app, this would connect to a payment gateway
      // For now, we'll just simulate a successful recharge
      const response = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          type: "recharge",
          description: `Manual recharge of ${amount} credits`,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to recharge wallet");
      }

      setSuccess(`Successfully added ${amount} credits to your wallet!`);
      
      // Refresh the page after a successful recharge
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error("Error recharging wallet:", err);
      setError(err instanceof Error ? err.message : "Failed to recharge wallet");
    } finally {
      setLoading(false);
    }
  };

  const presetAmounts = [50, 100, 200, 500];

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Recharge Your Wallet</h1>
        <Link
          href="/chat"
          className="rounded-md bg-gray-100 px-4 py-2 text-sm transition hover:bg-gray-200"
        >
          Back to Chats
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Select Amount</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {presetAmounts.map((presetAmount) => (
                <button
                  key={presetAmount}
                  type="button"
                  onClick={() => setAmount(presetAmount)}
                  className={`py-3 px-4 rounded-md border ${
                    amount === presetAmount
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                >
                  {presetAmount} Credits
                </button>
              ))}
            </div>
            
            <form onSubmit={handleRecharge} className="space-y-4">
              <div>
                <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Or enter custom amount:
                </label>
                <input
                  id="custom-amount"
                  type="number"
                  min="10"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              {error && (
                <div className="rounded-md bg-red-50 p-4 text-red-700">
                  <p>{error}</p>
                </div>
              )}
              
              {success && (
                <div className="rounded-md bg-green-50 p-4 text-green-700">
                  <p>{success}</p>
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={loading || amount < 10}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {loading ? "Processing..." : `Recharge ${amount} Credits`}
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                Note: This is a demo application. No actual payment will be processed.
              </p>
            </form>
          </div>
        </div>
        
        <div>
          <WalletDisplay />
          
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <h3 className="font-semibold mb-2">Why Recharge?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• AI responses cost between 10-20 credits depending on the Pandit's expertise level</li>
              <li>• Basic Pandits: 10 credits | Experienced: 15 credits | Expert: 20 credits</li>
              <li>• Your messages are always free</li>
              <li>• Consult with specialized Pandits</li>
              <li>• Get personalized guidance and advice</li>
              <li>• Higher credit packages offer better value</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 