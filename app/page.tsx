"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/chat");
    }
  }, [status, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <header className="mb-8 w-full max-w-2xl text-center">
        <h1 className="mb-2 text-4xl font-bold">Pandit AI</h1>
        <p className="text-xl text-gray-600">
          Your spiritual companion powered by AI
        </p>
      </header>
      <main className="mb-8 w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-md">
          {status === "loading" ? (
            <div className="flex justify-center py-4">
              <div className="text-lg">Loading...</div>
            </div>
          ) : status === "authenticated" ? (
            <div className="flex flex-col items-center py-4">
              <p className="mb-4 text-center">Redirecting to your chats...</p>
              <Link
                href="/chat"
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                Go to Chats
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="mb-6 text-center text-gray-700">
                Sign in to start a conversation with Pandit AI.
              </p>
              <Link
                href="/auth/signin"
                className="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </main>
      <footer className="mt-auto text-center text-sm text-gray-500">
        Pandit AI © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
