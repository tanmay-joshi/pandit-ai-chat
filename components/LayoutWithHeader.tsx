"use client";

import { WalletHeader } from "@/components/WalletHeader";
import { usePathname } from "next/navigation";

export function LayoutWithHeader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatPage = pathname?.startsWith("/chat/");
  return (
    <>
      {!isChatPage && <WalletHeader />}
      <main className="min-h-screen">{children}</main>
    </>
  );
} 