"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import Image from "next/image";
import { Settings, MessageCircle, Bell, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  joinedAt: string;
  totalChats: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (status !== "authenticated") return;

      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          console.warn("Could not fetch profile data, falling back to session data");
          setLoading(false);
          return;
        }
        const data = await response.json();
        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.warn("Error fetching profile, using session data:", err);
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      const timer = setTimeout(() => {
        fetchProfile();
      }, 500);
      return () => clearTimeout(timer);
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  if (status === "loading" || loading) {
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
          <p className="mb-6 font-libre-regular text-muted-foreground">Please sign in to view your profile</p>
          <Button onClick={() => window.location.href = "/"} className="font-libre-regular">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  // Always use session data as fallback if profile data is not available
  const userData = profile || {
    id: session?.user?.id || "",
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    image: session?.user?.image || null,
    joinedAt: new Date().toISOString(),
    totalChats: 0
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-libre-bold mb-4">My Profile</h1>
      <p className="text-muted-foreground font-libre-regular mb-8">
        Manage your profile and account settings
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="group relative rounded-2xl bg-[#F8F7F4] p-6 border-[0.1rem] border-[#212121] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1),0_-1px_2px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-white/20 before:backdrop-blur-[2px] after:absolute after:inset-0 after:-z-20 after:rounded-[inherit] after:bg-gradient-to-b after:from-white/80 after:to-white/20">
          <div className="flex flex-col items-center">
            <div className="mb-4 relative w-32 h-32 rounded-full overflow-hidden bg-[#F8F7F4] border-[0.1rem] border-[#212121] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)]">
              {userData.image ? (
                <Image
                  src={userData.image}
                  alt={userData.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#F8F7F4] text-[#212121] text-4xl font-libre-bold">
                  {userData.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-libre-bold">{userData.name}</h2>
            <p className="text-muted-foreground font-libre-regular mb-6">{userData.email}</p>
            <div className="text-sm text-muted-foreground font-libre-regular">
              Member since {new Date(userData.joinedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Statistics & Settings */}
        <div className="md:col-span-2 space-y-6">
          {/* Statistics */}
          <div className="group relative rounded-2xl bg-[#F8F7F4] p-6 border-[0.1rem] border-[#212121] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1),0_-1px_2px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-white/20 before:backdrop-blur-[2px] after:absolute after:inset-0 after:-z-20 after:rounded-[inherit] after:bg-gradient-to-b after:from-white/80 after:to-white/20">
            <h2 className="text-xl font-libre-bold mb-4">Your Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/50 p-4 border-[0.1rem] border-[#212121]/10">
                <h3 className="text-sm text-muted-foreground font-libre-regular mb-1">Total Consultations</h3>
                <p className="text-3xl font-libre-bold text-primary">{userData.totalChats}</p>
              </div>
              <div className="rounded-xl bg-white/50 p-4 border-[0.1rem] border-[#212121]/10">
                <h3 className="text-sm text-muted-foreground font-libre-regular mb-1">Recent Activity</h3>
                <p className="text-3xl font-libre-bold text-primary">
                  {userData.totalChats > 0 ? "Active" : "No activity"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="group relative rounded-2xl bg-[#F8F7F4] p-6 border-[0.1rem] border-[#212121] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1),0_-1px_2px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-white/20 before:backdrop-blur-[2px] after:absolute after:inset-0 after:-z-20 after:rounded-[inherit] after:bg-gradient-to-b after:from-white/80 after:to-white/20">
            <h2 className="text-xl font-libre-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/profile/kundali" className="group/item flex items-center justify-between p-4 rounded-xl bg-white/50 border-[0.1rem] border-[#212121]/10 transition-colors hover:bg-white/80">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-libre-bold">Manage Kundalis</h3>
                    <p className="text-sm text-muted-foreground font-libre-regular">View and edit your kundali profiles</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform group-hover/item:translate-x-1" />
              </Link>

              <button disabled className="w-full flex items-center justify-between p-4 rounded-xl bg-white/50 border-[0.1rem] border-[#212121]/10 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-libre-bold">Account Settings</h3>
                    <p className="text-sm text-muted-foreground font-libre-regular">Update your account preferences</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <button disabled className="w-full flex items-center justify-between p-4 rounded-xl bg-white/50 border-[0.1rem] border-[#212121]/10 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-libre-bold">Notifications</h3>
                    <p className="text-sm text-muted-foreground font-libre-regular">Manage your notification settings</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <button disabled className="w-full flex items-center justify-between p-4 rounded-xl bg-white/50 border-[0.1rem] border-[#212121]/10 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-libre-bold">Privacy & Security</h3>
                    <p className="text-sm text-muted-foreground font-libre-regular">Update your security preferences</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-md shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
} 