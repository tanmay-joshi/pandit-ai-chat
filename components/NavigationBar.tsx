'use client'

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageSquare, User, Wallet, BookOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavigationBar() {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: "/chat/new",
      icon: Plus,
      label: "New Chat",
      isActive: pathname === "/chat/new"
    },
    {
      href: "/chat",
      icon: MessageSquare,
      label: "Chats",
      isActive: pathname === "/chat" || pathname.startsWith("/chat/") && pathname !== "/chat/new"
    },
    {
      href: "/profile/kundali",
      icon: BookOpen,
      label: "Kundalis",
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
    <>
      {/* Desktop - Floating Vertical Bar */}
      <div className="fixed left-6 top-6 z-50 hidden md:flex">
        <div className="flex flex-col gap-2 rounded-2xl bg-black/90 p-3 backdrop-blur-md">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/10",
                item.isActive && "bg-white/10"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 text-white/70 transition-colors group-hover:text-white",
                item.isActive && "text-white"
              )} />
              
              {/* Tooltip */}
              <span className="absolute left-full ml-2 hidden rounded-md bg-black/90 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 lg:block">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile - Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-2 backdrop-blur-lg md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center rounded-lg px-3 py-2",
                item.isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="mt-1 text-[10px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
} 