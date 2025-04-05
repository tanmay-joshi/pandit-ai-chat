"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

type Pandit = {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/chat");
    }
  }, [status, router]);

  useEffect(() => {
    // Fetch pandits even if not logged in to display on homepage
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => {
        setPandits(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch pandits:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <header className="mb-8 w-full max-w-2xl text-center">
        <h1 className="mb-2 text-4xl font-bold">Pandit AI</h1>
        <p className="text-xl text-gray-600">
          Your spiritual companion powered by AI
        </p>
      </header>
      
      <main className="w-full max-w-4xl mb-8">
        <div className="rounded-lg bg-white p-8 shadow-md">
          {status === "loading" || loading ? (
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
            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold mb-6 text-center">Consult with our wise Pandits</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {pandits.map((pandit) => (
                  <div key={pandit.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-3">
                      {pandit.avatar ? (
                        <div className="relative w-16 h-16 mr-4 rounded-full overflow-hidden">
                          <Image 
                            src={pandit.avatar} 
                            alt={pandit.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 mr-4 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-700 text-xl font-bold">{pandit.name.charAt(0)}</span>
                        </div>
                      )}
                      <h3 className="text-xl font-medium">{pandit.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{pandit.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center">
                <Link
                  href="/auth/signin"
                  className="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
                >
                  Sign In to Consult
                </Link>
              </div>
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
