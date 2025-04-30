'use client'

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, MessageSquare, User, Wallet, BookOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavigationBar() {
  const pathname = usePathname();
  
  // Hide navigation on individual chat pages
  const isChatDetailPage = pathname.match(/^\/chat\/[^/]+$/) && pathname !== "/chat/new";
  
  if (isChatDetailPage) {
    return null;
  }

  const navigationItems = [
    {
      href: "/home",
      icon: Home,
      label: "Home",
      isActive: pathname === "/home"
    },
    {
      href: "/chat",
      icon: MessageSquare,
      label: "Chats",
      isActive: pathname === "/chat" || (pathname.startsWith("/chat/") && pathname !== "/chat/new")
    },
    {
      href: "/profile/kundali",
      icon: BookOpen,
      label: "Kundali",
      isActive: pathname === "/profile/kundali"
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
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="relative w-full max-w-md flex justify-center">
        {/* Main nav bar */}
        <div className="pointer-events-auto flex items-center justify-between w-full max-w-[340px] mx-auto px-2 py-2 bg-white rounded-full shadow-lg border border-gray-100">
          {navigationItems.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center justify-center transition-all duration-200 h-12",
                item.isActive ? "bg-black text-white px-4 rounded-full shadow-md" : "text-black/80 px-3",
                idx === 0 && "ml-1",
                idx === navigationItems.length - 1 && "mr-1"
              )}
              style={{ minWidth: item.isActive ? 80 : 44 }}
            >
              <item.icon className={cn("w-5 h-5", item.isActive ? "text-white" : "text-black/80")}/>
              {item.isActive && (
                <span className="ml-2 font-primary-medium text-sm hidden sm:inline">{item.label}</span>
              )}
            </Link>
          ))}
        </div>
        {/* Floating New Chat Button */}
        <Link
          href="/chat/new"
          className="pointer-events-auto absolute -right-6 top-1/2 -translate-y-1/2 bg-black text-white rounded-full shadow-lg border-4 border-white w-14 h-14 flex items-center justify-center hover:bg-gray-900 transition-all"
        >
          <Plus className="w-7 h-7" />
        </Link>
      </div>
    </div>
  );
} 