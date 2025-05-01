"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import WalletDisplay from "@/components/WalletDisplay";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

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

    if (!session?.user?.email) {
      setError("User session not found. Please login again.");
      setLoading(false);
      return;
    }

    // 1. Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError("Failed to load Razorpay SDK. Please try again.");
      setLoading(false);
      return;
    }

    try {
      // 2. Create order on backend
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order");

      // 3. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Pandit AI Wallet Recharge",
        description: `Recharge of ${amount} credits`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // 4. On payment success, verify payment and credit wallet
          setLoading(true);
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount,
                email: session.user.email,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");
            setSuccess(`Successfully added ${amount} credits to your wallet!`);
            setTimeout(() => {
              router.refresh();
            }, 2000);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to verify payment");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          email: session.user.email,
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate payment");
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
                Payments are securely processed via Razorpay. Your wallet will be credited instantly after successful payment.
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