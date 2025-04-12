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
      <div className="flex min-h-screen items-center justify-center neu-container">
        <Loading size="lg" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 neu-container">
        <div className="neu-card">
          <h1 className="neu-title neu-2xl mb-4">Access Denied</h1>
          <p className="mb-6 neu-text text-muted-foreground">Please sign in to view your profile</p>
          <Button onClick={() => window.location.href = "/"} className="neu-button neu-button-hover">
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
    <div className="fixed inset-0 flex flex-col overflow-hidden neu-container">
      <header className="px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="neu-title neu-3xl">My Profile</h1>
          <p className="neu-text text-muted-foreground">
            Manage your profile and account settings
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="neu-card">
              <div className="flex flex-col items-center">
                <div className="mb-4 relative w-32 h-32 rounded-full overflow-hidden neu-inset">
                  {userData.image ? (
                    <Image
                      src={userData.image}
                      alt={userData.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center neu-text text-4xl neu-title">
                      {userData.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <h2 className="neu-title neu-2xl">{userData.name}</h2>
                <p className="neu-text text-muted-foreground mb-6">{userData.email}</p>
                <div className="neu-text text-sm text-muted-foreground">
                  Member since {new Date(userData.joinedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Statistics & Settings */}
            <div className="md:col-span-2 space-y-6">
              {/* Statistics */}
              <div className="neu-card">
                <h2 className="neu-title neu-xl mb-4">Your Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="neu-inset p-4">
                    <h3 className="neu-text text-sm text-muted-foreground mb-1">Total Consultations</h3>
                    <p className="neu-title neu-3xl text-primary">{userData.totalChats}</p>
                  </div>
                  <div className="neu-inset p-4">
                    <h3 className="neu-text text-sm text-muted-foreground mb-1">Recent Activity</h3>
                    <p className="neu-title neu-3xl text-primary">
                      {userData.totalChats > 0 ? "Active" : "No activity"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="neu-card">
                <h2 className="neu-title neu-xl mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Link href="/profile/kundali" className="group/item flex items-center justify-between p-4 neu-inset transition-all duration-300 hover:neu-inset-hover">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="neu-title">Manage Kundalis</h3>
                        <p className="neu-text text-sm text-muted-foreground">View and edit your kundali profiles</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform group-hover/item:translate-x-1" />
                  </Link>

                  <button disabled className="w-full flex items-center justify-between p-4 neu-inset opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="neu-title">Account Settings</h3>
                        <p className="neu-text text-sm text-muted-foreground">Update your account preferences</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>

                  <button disabled className="w-full flex items-center justify-between p-4 neu-inset opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="neu-title">Notifications</h3>
                        <p className="neu-text text-sm text-muted-foreground">Manage your notification settings</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>

                  <button disabled className="w-full flex items-center justify-between p-4 neu-inset opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="neu-title">Privacy & Security</h3>
                        <p className="neu-text text-sm text-muted-foreground">Update your security preferences</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 neu-error">
          {error}
        </div>
      )}
    </div>
  );
} 