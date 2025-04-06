"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/chat");
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, router]);

  if (isLoading && status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white overflow-hidden relative">
      {/* Prismatic light effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] bg-gradient-to-l from-indigo-500/20 via-yellow-500/20 to-blue-500/20 blur-[120px] rounded-full"></div>
      </div>
      
      {/* Header/Navigation */}
      <header className="w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800 z-10 sticky top-0">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              <span className="text-purple-400">Pandit</span> AI
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
          </nav>
          <div>
            <Link
              href="/auth/signin"
              className="rounded-md bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2 text-white transition-all hover:bg-white/20 shadow-[0_0_10px_rgba(123,0,255,0.2)] hover:shadow-[0_0_15px_rgba(123,0,255,0.4)] relative group overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">Sign In</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 md:py-32 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 tracking-tight">
              Your Spiritual <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Guidance</span> Powered by AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
              Connect with the most advanced AI pandits to discover your destiny, understand your path, and find spiritual clarity.
            </p>
            <Link
              href="/auth/signin"
              className="group relative inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-lg font-medium text-white overflow-hidden transition-all shadow-[0_0_15px_rgba(123,0,255,0.5)] hover:shadow-[0_0_25px_rgba(123,0,255,0.7)] duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute -inset-x-1 -bottom-1 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70"></span>
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" className="shrink-0 relative z-10">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                </g>
              </svg>
              <span className="relative z-10">Sign up with Google</span>
            </Link>
          </div>
          
          {/* Visual element - Prism/Geometric shape */}
          <div className="flex justify-center relative">
            <div className="relative w-full max-w-3xl aspect-[16/9] mx-auto prism-light prism-beam">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-indigo-500/30 rounded-lg backdrop-blur-md"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1/2 h-1/2 relative">
                  {/* Pyramid/prism geometric shape effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/50 via-transparent to-transparent transform rotate-45 skew-y-12"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-pink-500/50 to-transparent transform -rotate-45 skew-y-12"></div>
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-purple-500/50 to-transparent"></div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                <h2 className="text-2xl md:text-4xl font-bold rainbow-text">
                  Discover your cosmic journey with AI-powered astrology
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 relative z-10 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose <span className="text-purple-400">Pandit AI</span>?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-lg border border-gray-800 transform transition-all hover:border-purple-500/50 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced AI Technology</h3>
              <p className="text-gray-400">Our state-of-the-art AI models provide deep astrological insights with unprecedented accuracy and personalization.</p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-lg border border-gray-800 transform transition-all hover:border-indigo-500/50 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Availability</h3>
              <p className="text-gray-400">Access spiritual guidance and astrological insights whenever you need them, day or night, with no waiting.</p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-lg border border-gray-800 transform transition-all hover:border-pink-500/50 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized Guidance</h3>
              <p className="text-gray-400">Receive spiritual insights tailored to your unique birth chart, life circumstances, and personal journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="w-full py-20 relative z-10 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-lg border border-gray-800">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mr-4 text-white font-bold">
                  R
                </div>
                <div>
                  <h4 className="font-semibold">Rahul M.</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 italic">"The insights I received were incredibly accurate. It's like having a personal astrologer available at any time!"</p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-lg border border-gray-800">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center mr-4 text-white font-bold">
                  P
                </div>
                <div>
                  <h4 className="font-semibold">Priya S.</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 italic">"I was skeptical at first, but the predictions were surprisingly accurate. This app has become my go-to for astrological guidance."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 relative border-t border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 prism-light"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to Discover Your Future?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-300">Start your cosmic journey with Pandit AI today and gain insights into your life, relationships, career, and spiritual path.</p>
          <Link
            href="/auth/signin"
            className="group relative inline-flex items-center justify-center gap-2 rounded-md bg-white px-8 py-4 text-lg font-medium text-gray-900 overflow-hidden transition-all hover:bg-gray-100 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] duration-300"
          >
            <span className="absolute -inset-x-1 -bottom-1 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70"></span>
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
              </g>
            </svg>
            Sign up with Google
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-950 text-gray-400 py-10 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <h3 className="text-2xl font-bold text-white">
              <span className="text-purple-400">Pandit</span> AI
            </h3>
          </div>
          <p>© {new Date().getFullYear()} Pandit AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
