"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
          // Don't throw error, just let it use session data as fallback
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

    // Small delay to ensure session is properly loaded
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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">Please sign in to view your profile</p>
          <Button onClick={() => window.location.href = "/"}>Go to Homepage</Button>
        </Card>
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
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex flex-col items-center">
            <div className="mb-4 relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
              {userData.image ? (
                <Image
                  src={userData.image}
                  alt={userData.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-800 text-4xl font-bold">
                  {userData.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-semibold">{userData.name}</h2>
            <p className="text-gray-500 mb-6">{userData.email}</p>
            <div className="text-sm text-gray-500 mt-2">
              Member since {new Date(userData.joinedAt).toLocaleDateString()}
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Total Consultations</h3>
              <p className="text-3xl font-bold text-blue-600">{userData.totalChats}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Recent Activity</h3>
              <p className="text-3xl font-bold text-green-600">
                {userData.totalChats > 0 ? "Active" : "No activity"}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <div className="space-y-2">
              <Button className="w-full" disabled>
                Edit Profile (Coming Soon)
              </Button>
              <Button className="w-full" variant="outline" disabled>
                Change Password (Coming Soon)
              </Button>
              <Button className="w-full" variant="outline" disabled>
                Notification Settings (Coming Soon)
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 