"use client";
import { useSession } from "next-auth/react";
import { NavigationBar } from "@/components/NavigationBar";

export function AuthNavigationBar() {
  const { status } = useSession();
  if (status === "authenticated") {
    return <NavigationBar />;
  }
  return null;
} 