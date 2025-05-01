"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function WalletHeader() {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      if (status !== "authenticated") return;
      try {
        const response = await fetch("/api/wallet");
        if (!response.ok) throw new Error("Failed to fetch wallet");
        const data = await response.json();
        setBalance(data.wallet?.balance ?? 0);
      } catch {
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, [status]);

  return (
    <header className="w-full bg-[var(--bg-white)] border-b border-gray-200 py-2 shadow-sm z-20">
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full px-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <img src="/next.svg" alt="Logo" className="h-8 w-8 mr-2" />
          </Link>
          <span className="neu-title neu-xl font-bold tracking-tight select-none">Pandit AI</span>
        </div>
        <div className="flex items-center gap-4">
          {status === "authenticated" && (
            <>
              <span className="neu-text neu-base">
                {loading ? "Loading..." : (
                  <span>Credits: <span className={balance !== null && balance < 20 ? "text-red-500" : "text-green-600"}>{balance ?? "-"}</span></span>
                )}
              </span>
              <Link href="/wallet/recharge">
                <button className="neu-button neu-button-hover px-4 py-2 text-sm">Recharge</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 