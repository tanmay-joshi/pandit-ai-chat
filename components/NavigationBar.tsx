'use client'

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageSquare, User, Wallet, BookOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavigationBar() {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: "/chat",
      icon: MessageSquare,
      label: "All Chats",
      isActive: pathname === "/chat" || (pathname.startsWith("/chat/") && pathname !== "/chat/new")
    },
    {
      href: "/profile/kundali",
      icon: BookOpen,
      label: "Kundali",
      isActive: pathname === "/profile/kundali"
    },
    {
      href: "/chat/new",
      icon: Plus,
      label: "New Chat",
      isActive: pathname === "/chat/new"
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
      isActive: pathname === "/profile"
    },
    {
      href: "/wallet",
      icon: Wallet,
      label: "Wallet",
      isActive: pathname === "/wallet"
    }
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-4">
      <div className="mx-auto max-w-[320px]">
        <div className="relative flex items-center justify-between rounded-full bg-black/90 px-6 py-3 shadow-lg backdrop-blur-sm">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex flex-col items-center transition-all duration-200",
                item.isActive && "before:absolute before:-top-[6px] before:h-1 before:w-1 before:rounded-full before:bg-red-500"
              )}
            >
              <div className={cn(
                "relative rounded-full p-1.5 transition-all duration-200",
                item.isActive && "after:absolute after:inset-0 after:animate-ping after:rounded-full after:bg-red-500/50"
              )}>
                <item.icon className={cn(
                  "h-5 w-5 transition-colors",
                  item.isActive 
                    ? "text-red-500 drop-shadow-[0_0_3px_rgba(239,68,68,0.5)]" 
                    : "text-gray-400 group-hover:text-gray-200"
                )} />
              </div>
              {/* <span className={cn(
                "absolute -bottom-5 whitespace-nowrap text-[10px] font-primary-medium transition-colors",
                item.isActive 
                  ? "text-red-500" 
                  : "text-gray-400 group-hover:text-gray-200"
              )}>
                {item.label}
              </span> */}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 