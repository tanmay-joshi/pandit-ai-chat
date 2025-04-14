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
      router.push("/chat/new");
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, router]);

  if (isLoading && status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-800">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      {/* Header/Navigation */}
      <header className="w-full bg-white shadow-sm z-10 sticky top-0">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="PanditAI Logo" width={40} height={40} />
            <h1 className="text-2xl font-semibold text-gray-900">
              <span className="text-orange-600">panditai</span>.in
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#pandits" className="text-gray-600 hover:text-orange-600 transition-colors">Our Pandits</a>
            <a href="#pricing" className="text-gray-600 hover:text-orange-600 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-600 hover:text-orange-600 transition-colors">Testimonials</a>
          </nav>
          <div>
            <Link
              href="/auth/signin"
              className="rounded-md bg-orange-600 px-5 py-2 text-white transition-all hover:bg-orange-700 shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900">
                Chat with India's most <span className="text-orange-600">knowledgeable Pandit</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                Get instant spiritual guidance, astrological insights, and wisdom from ancient texts - all powered by AI that understands Vedic traditions.
              </p>
              <div className="pt-4">
                <Link
                  href="/auth/signin"
                  className="rounded-md bg-orange-600 px-8 py-3 text-lg font-medium text-white transition-all hover:bg-orange-700 shadow-md inline-flex items-center gap-2"
                >
                  Start Free Consultation
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-600 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  No credit card required
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-600 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cancel anytime
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center relative">
              <div className="w-full max-w-md aspect-square relative rounded-full overflow-hidden border-8 border-orange-100">
                <Image 
                  src="/images/pandits/pandit.png" 
                  alt="AI Pandit" 
                  fill 
                  style={{objectFit: "cover"}}
                  className="rounded-full"
                />
              </div>
              <div className="absolute -bottom-6 right-8 bg-white px-6 py-3 rounded-xl shadow-lg border border-orange-100">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">P</div>
                    <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs">A</div>
                    <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center text-white text-xs">V</div>
                  </div>
                  <span className="text-sm font-medium">25,000+ consultations</span>
                </div>
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
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how PanditAI is transforming spiritual guidance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 text-orange-600 font-bold">
                  R
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Rahul M.</h4>
                  <div className="flex text-orange-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"The insights I received were incredibly accurate. It's like having a personal astrologer available at any time!"</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 text-orange-600 font-bold">
                  P
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Priya S.</h4>
                  <div className="flex text-orange-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"I was skeptical at first, but the predictions were surprisingly accurate. This app has become my go-to for astrological guidance."</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 text-orange-600 font-bold">
                  A
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Amit B.</h4>
                  <div className="flex text-orange-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"The business advice from Vyapar Guru helped me make crucial decisions for my startup. The AI understands nuances that surprised me."</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How accurate are the AI Pandit consultations?</h3>
              <p className="text-gray-600">Our AI Pandits draw from extensive knowledge of Vedic scriptures, astrology, and spiritual texts. While they provide insightful guidance based on this knowledge, they are meant to complement, not replace, traditional guidance.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I ask questions in Hindi or other Indian languages?</h3>
              <p className="text-gray-600">Yes, our AI Pandits understand and respond in multiple Indian languages including Hindi, Tamil, Telugu, Bengali, and more, making spiritual guidance accessible to everyone.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How is my personal information protected?</h3>
              <p className="text-gray-600">We take privacy seriously. Your personal information and consultation details are encrypted and never shared with third parties. You can review our privacy policy for more details.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change my subscription plan?</h3>
              <p className="text-gray-600">Yes, you can upgrade, downgrade, or cancel your subscription at any time from your account settings. Changes take effect at the beginning of your next billing cycle.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Start Your Spiritual Journey Today</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600">
            Get personalized guidance from India's most knowledgeable AI Pandits and unlock cosmic insights about your life path.
          </p>
          <Link
            href="/auth/signin"
            className="rounded-md bg-orange-600 px-8 py-3 text-lg font-medium text-white transition-all hover:bg-orange-700 shadow-md inline-flex items-center gap-2"
          >
            Begin Free Consultation
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <div className="mt-4 text-sm text-gray-500">No credit card required • Start instantly</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-600 py-12 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/images/logo.png" alt="PanditAI Logo" width={36} height={36} />
                <h3 className="text-xl font-semibold text-gray-900">
                  <span className="text-orange-600">panditai</span>.in
                </h3>
              </div>
              <p className="text-gray-500 text-sm">AI-powered spiritual guidance combining ancient wisdom with modern technology.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">Astrology Consultation</a></li>
                <li><a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">Career Guidance</a></li>
                <li><a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">Relationship Advice</a></li>
                <li><a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">Health & Wellness</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-500 hover:text-orange-600 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Connect With Us</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
              </div>
              <p className="text-sm text-gray-500">Subscribe to our newsletter</p>
              <div className="mt-2 flex">
                <input type="email" placeholder="Your email" className="bg-gray-50 border border-gray-200 rounded-l-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent" />
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 rounded-r-md text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} panditai.in. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
