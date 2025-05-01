"use client";

import { WalletHeader } from "@/components/WalletHeader";
import { usePathname } from "next/navigation";

export function LayoutWithHeader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatPage = pathname?.startsWith("/chat/");
  const isLandingPage = pathname === "/";
  return (
    <>
      <main className="min-h-screen">
        {!isChatPage && !isLandingPage && <WalletHeader />}
        {children}
      </main>
    </>
  );
} 