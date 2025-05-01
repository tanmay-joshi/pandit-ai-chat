"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import mixpanel from "@/lib/mixpanel";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home");
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
    if (
      typeof window !== "undefined" &&
      (window as any).mixpanelReady &&
      mixpanel &&
      typeof mixpanel.track === "function"
    ) {
      mixpanel.track("Page Opened", { page: "Landing" });
    }
  }, [status, router]);

  if (isLoading && status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F2EE]">
        <div className="text-xl text-gray-800">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EE] text-gray-900">
      {/* Header/Navigation */}
      <header className="w-full bg-[#F5F2EE] z-10 sticky top-0 border-b border-gray-200">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif text-gray-900">
              pandit<span className="font-normal">ai</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-12">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">How It Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Pricing</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Testimonials</a>
          </nav>
          <div>
            <Link
              href="/auth/signin"
              className="rounded-full bg-gray-900 px-6 py-2 text-sm text-white transition-all hover:bg-gray-800"
              onClick={() => mixpanel.track("Button Clicked", { button: "Get Started" })}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main>
      {/* Hero Section */}
        <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 max-w-6xl">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-5xl md:text-6xl font-serif leading-tight">
                Your Personal AI Spiritual Guide
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the perfect blend of ancient wisdom and modern technology, available 24/7 for personalized guidance.
              </p>
              
              {/* Chat Input Box */}
              <div className="mt-12 max-w-3xl mx-auto">
                <div className="bg-white rounded-t-[2rem] p-6 shadow-sm border border-gray-200">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    mixpanel.track("Chat Input Submitted", { location: "Landing" });
                    if (status === "authenticated") {
                      router.push("/chat/new");
                    } else {
                      router.push("/auth/signin");
                    }
                  }}>
                    <div className="flex items-center gap-4">
                      <input 
                        type="text" 
                        placeholder="Ask your AI Pandit anything..." 
                        className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                      <button 
                        type="submit"
                        className="bg-gray-900 text-white rounded-full p-3 hover:bg-gray-800 transition-colors"
                      >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                      </button>
                    </div>
                  </form>
                  
                  {/* Example Prompts */}
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {[
                      "What does my birth chart say about my career?",
                      "How can I improve my relationship?",
                      "Should I start a new business now?",
                      "What meditation practice suits me?"
                    ].map((prompt, index) => (
                      <button 
                        key={index}
                        onClick={() => {
                          mixpanel.track("Example Prompt Clicked", { prompt });
                          if (status === "authenticated") {
                            router.push("/chat/new");
                          } else {
                            router.push("/auth/signin");
                          }
                        }}
                        className="px-4 py-2 bg-[#F5F2EE] rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Trust Indicator */}
              <div className="pt-16">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">P</div>
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">A</div>
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-xs">V</div>
                  </div>
                  <p className="text-sm text-gray-600">Trusted by 25,000+ seekers worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Value Proposition Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl font-serif">Why Choose PanditAI</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ancient wisdom meets modern technology
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="relative">
                <div className="h-64 bg-[#F5F2EE] rounded-t-[2rem] mb-8"></div>
                <h3 className="text-xl font-serif mb-4">Personalized Guidance</h3>
                <p className="text-gray-600">Our AI analyzes your unique birth details and circumstances to provide truly personalized insights, just like a traditional pandit would.</p>
              </div>
              
              <div className="relative">
                <div className="h-64 bg-[#F5F2EE] rounded-t-[2rem] mb-8"></div>
                <h3 className="text-xl font-serif mb-4">Available 24/7</h3>
                <p className="text-gray-600">No more waiting for appointments. Get immediate answers to your spiritual questions anytime, anywhere in the world.</p>
              </div>
              
              <div className="relative">
                <div className="h-64 bg-[#F5F2EE] rounded-t-[2rem] mb-8"></div>
                <h3 className="text-xl font-serif mb-4">Vedic Knowledge</h3>
                <p className="text-gray-600">Access authentic guidance based on ancient texts and traditional astrology through modern technology.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Use Cases Section */}
        <section className="py-24 bg-[#F5F2EE]">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl font-serif">How PanditAI Can Help You</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real solutions for life's most important questions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Use Case 1 */}
              <div className="bg-white p-12 rounded-t-[2rem]">
                <div className="space-y-6">
                  <h3 className="text-xl font-serif">Relationship Guidance</h3>
                  <p className="text-gray-600">
                    "I was unsure about my compatibility with my partner. PanditAI analyzed our birth charts and provided insights that helped us understand each other better."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F5F2EE] rounded-full flex items-center justify-center text-gray-900 font-serif">
                      A
                    </div>
                    <div>
                      <p className="font-serif">Anita K.</p>
                      <p className="text-sm text-gray-600">Relationship issues resolved</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Use Case 2 */}
              <div className="bg-white p-12 rounded-t-[2rem]">
                <div className="space-y-6">
                  <h3 className="text-xl font-serif">Career Decisions</h3>
                  <p className="text-gray-600">
                    "I was at a career crossroads and needed guidance. PanditAI helped me understand which path aligned better with my strengths based on my birth chart."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F5F2EE] rounded-full flex items-center justify-center text-gray-900 font-serif">
                      R
                    </div>
                    <div>
                      <p className="font-serif">Rahul M.</p>
                      <p className="text-sm text-gray-600">Found career clarity</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Use Case 3 */}
              <div className="bg-white p-12 rounded-t-[2rem]">
                <div className="space-y-6">
                  <h3 className="text-xl font-serif">Managing Stress & Anxiety</h3>
                  <p className="text-gray-600">
                    "During a particularly stressful time, PanditAI suggested specific spiritual practices based on my birth chart that helped me find peace."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F5F2EE] rounded-full flex items-center justify-center text-gray-900 font-serif">
                      S
                    </div>
                    <div>
                      <p className="font-serif">Sanjay D.</p>
                      <p className="text-sm text-gray-600">Reduced anxiety levels</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Use Case 4 */}
              <div className="bg-white p-12 rounded-t-[2rem]">
                <div className="space-y-6">
                  <h3 className="text-xl font-serif">Business Decisions</h3>
                  <p className="text-gray-600">
                    "I was planning to start a new business venture. PanditAI's insights on auspicious timing and potential challenges helped me launch successfully."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F5F2EE] rounded-full flex items-center justify-center text-gray-900 font-serif">
                      V
                    </div>
                    <div>
                      <p className="font-serif">Vishal P.</p>
                      <p className="text-sm text-gray-600">Successful business launch</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl font-serif">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get spiritual guidance in three simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-white border-t-2 border-gray-900 pt-12">
                  <div className="absolute -top-6 left-0 font-serif text-5xl text-gray-900">01</div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif">Create Your Profile</h3>
                    <p className="text-gray-600">
                      Sign up and enter your birth details. Our AI will generate your personalized birth chart.
                    </p>
                    <div className="aspect-video relative overflow-hidden bg-[#F5F2EE] rounded-t-[2rem]">
                      <Image 
                        src="/images/pandits/pandit.png" 
                        alt="Create Profile Screenshot" 
                        fill 
                        style={{objectFit: "cover"}}
                        className="rounded-t-[2rem]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative">
                <div className="bg-white border-t-2 border-gray-900 pt-12">
                  <div className="absolute -top-6 left-0 font-serif text-5xl text-gray-900">02</div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif">Select Your AI Pandit</h3>
                    <p className="text-gray-600">
                      Choose from our specialized AI Pandits for career, relationships, spirituality, or general guidance.
                    </p>
                    <div className="aspect-video relative overflow-hidden bg-[#F5F2EE] rounded-t-[2rem]">
                <Image 
                  src="/images/pandits/pandit.png" 
                        alt="Select Pandit Screenshot" 
                  fill 
                  style={{objectFit: "cover"}}
                        className="rounded-t-[2rem]"
                />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative">
                <div className="bg-white border-t-2 border-gray-900 pt-12">
                  <div className="absolute -top-6 left-0 font-serif text-5xl text-gray-900">03</div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif">Get Instant Guidance</h3>
                    <p className="text-gray-600">
                      Chat with your AI Pandit and receive immediate personalized insights based on Vedic wisdom.
                    </p>
                    <div className="aspect-video relative overflow-hidden bg-[#F5F2EE] rounded-t-[2rem]">
                      <Image 
                        src="/images/pandits/pandit.png" 
                        alt="Chat Interface Screenshot" 
                        fill 
                        style={{objectFit: "cover"}}
                        className="rounded-t-[2rem]"
                      />
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-[#F5F2EE]">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl font-serif">Simple Pay-as-you-go Pricing</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Affordable spiritual guidance at just ₹3 per message
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {/* Free Trial */}
              <div className="bg-white p-12 rounded-t-[2rem]">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-serif mb-2">Free Trial</h3>
                    <p className="text-gray-600">Experience the power of AI spiritual guidance</p>
                  </div>
                  
                  <div>
                    <div className="text-4xl font-serif">₹0</div>
                    <div className="text-sm text-gray-600 mt-1">7 days of unlimited access</div>
                  </div>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex-shrink-0 mt-0.5"></div>
                      <span className="text-gray-600">Unlimited AI consultations for 7 days</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex-shrink-0 mt-0.5"></div>
                      <span className="text-gray-600">Access to all AI Pandits</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex-shrink-0 mt-0.5"></div>
                      <span className="text-gray-600">Basic birth chart analysis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex-shrink-0 mt-0.5"></div>
                      <span className="text-gray-600">No credit card required</span>
                    </li>
                  </ul>
                  
                  <div>
                    <Link href="/auth/signin" className="block w-full py-3 px-4 bg-white border-2 border-gray-900 text-gray-900 rounded-full text-center font-serif transition-colors hover:bg-gray-50">
                      Start Free Trial
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Pay as you go */}
              <div className="bg-white p-12 rounded-t-[2rem] relative">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-1 rounded-full text-sm font-serif">
                  Best Value
                </div>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-serif mb-2">Pay as you go</h3>
                    <p className="text-gray-600">Only pay for what you need</p>
                  </div>
                  
                  <div>
                    <div className="text-4xl font-serif">₹3<span className="text-lg text-gray-600">/message</span></div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="line-through">₹19/message</span>
                      <span className="text-gray-900 ml-2">84% off</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex-shrink-0 mt-0.5"></div>
                      <span className="text-gray-600">Access to all AI Pandits</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex-shrink-0 mt-0.5"></div>
                      <span className="text-gray-600">Detailed birth chart analysis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex-shrink-0 mt-0.5"></div>
                      <span className="text-gray-600">Personalized remedies & rituals</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex-shrink-0 mt-0.5"></div>
                      <span className="text-gray-600">24/7 support</span>
                    </li>
                  </ul>
                  
                  <div>
                    <Link href="/auth/signin" className="block w-full py-3 px-4 bg-gray-900 text-white rounded-full text-center font-serif transition-colors hover:bg-gray-800">
                      Get Started
                    </Link>
                  </div>
            </div>
              </div>
            </div>
            
            <div className="mt-16 bg-white p-12 rounded-t-[2rem] max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/4 flex justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gray-900"></div>
                  </div>
                </div>
                <div className="md:w-3/4 text-center md:text-left">
                  <h4 className="text-xl font-serif mb-3">Why we're 84% cheaper</h4>
                  <p className="text-gray-600">
                    By leveraging AI technology, we've dramatically reduced the cost of spiritual guidance while maintaining the highest quality of insights. We believe everyone should have access to authentic Vedic wisdom.
                  </p>
                </div>
            </div>
          </div>
        </div>
      </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl font-serif">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how PanditAI is transforming spiritual guidance
            </p>
          </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {/* Testimonial 1 */}
              <div className="bg-[#F5F2EE] p-12 rounded-t-[2rem]">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-serif">
                  R
                </div>
                <div>
                      <h4 className="font-serif">Rahul M.</h4>
                      <div className="text-sm text-gray-600">Using PanditAI for 6 months</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"The insights I received were incredibly accurate. It's like having a personal astrologer available anytime! PanditAI helped me make crucial decisions about my career path."</p>
                </div>
            </div>
            
              {/* Testimonial 2 */}
              <div className="bg-[#F5F2EE] p-12 rounded-t-[2rem]">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-serif">
                  P
                </div>
                <div>
                      <h4 className="font-serif">Priya S.</h4>
                      <div className="text-sm text-gray-600">Using PanditAI for 3 months</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"I was skeptical at first, but the predictions were surprisingly accurate. The relationship compatibility insights helped me understand my partner better and resolve our conflicts."</p>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-[#F5F2EE] p-12 rounded-t-[2rem]">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-serif">
                      V
                    </div>
                    <div>
                      <h4 className="font-serif">Vikas J.</h4>
                      <div className="text-sm text-gray-600">Using PanditAI for 4 months</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"The business advice from Vyapar Guru helped me make crucial decisions for my startup. The AI understands nuances that surprised me, and the timing suggestions were spot on."</p>
                </div>
            </div>
            
              {/* Testimonial 4 */}
              <div className="bg-[#F5F2EE] p-12 rounded-t-[2rem]">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-serif">
                  A
                </div>
                <div>
                      <h4 className="font-serif">Anita K.</h4>
                      <div className="text-sm text-gray-600">Using PanditAI for one year</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"The spiritual guidance I received during a difficult time was so comforting. The meditation techniques suggested based on my chart were exactly what I needed to find peace."</p>
                </div>
              </div>
              
              {/* Testimonial 5 */}
              <div className="bg-[#F5F2EE] p-12 rounded-t-[2rem]">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-serif">
                      S
                    </div>
                    <div>
                      <h4 className="font-serif">Sanjay P.</h4>
                      <div className="text-sm text-gray-600">Using PanditAI for 3 months</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"I've been consulting astrologers for years, but PanditAI provides insights just as valuable in a fraction of the time and cost. The convenience is unmatched."</p>
                </div>
              </div>
              
              {/* Testimonial 6 */}
              <div className="bg-[#F5F2EE] p-12 rounded-t-[2rem]">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-serif">
                      M
                    </div>
                    <div>
                      <h4 className="font-serif">Meera R.</h4>
                      <div className="text-sm text-gray-600">Using PanditAI for 5 months</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"As a mother, I wanted guidance for my child's education path. PanditAI analyzed his birth chart and provided insights that helped us make better educational choices."</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-16">
              <div className="inline-flex flex-col md:flex-row items-center gap-4 md:gap-12 bg-white p-8 rounded-t-[2rem]">
                <div className="font-serif text-xl">95% User Satisfaction</div>
                <div className="w-2 h-2 bg-gray-900 rounded-full hidden md:block"></div>
                <div className="font-serif text-xl">100,000+ Consultations Delivered</div>
              </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
        <section className="py-24 bg-[#F5F2EE]">
        <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl font-serif">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about PanditAI
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white p-12 rounded-t-[2rem]">
                <h3 className="text-xl font-serif mb-4">How accurate are the AI Pandit consultations?</h3>
                <p className="text-gray-600">Our AI Pandits are trained on extensive Vedic texts and astrological principles, providing insights with impressive accuracy. Many users report over 90% accuracy in predictions and recommendations. However, we believe in transparency - AI is a powerful tool for guidance, but personal intuition remains valuable.</p>
              </div>
              
              <div className="bg-white p-12 rounded-t-[2rem]">
                <h3 className="text-xl font-serif mb-4">Is my personal information and birth data secure?</h3>
                <p className="text-gray-600">Absolutely. We employ bank-level encryption to protect all your personal information and birth data. Your privacy is our top priority, and we never share your information with third parties. You can consult with complete peace of mind knowing your data remains confidential.</p>
              </div>
              
              <div className="bg-white p-12 rounded-t-[2rem]">
                <h3 className="text-xl font-serif mb-4">Can I ask questions in Hindi or other Indian languages?</h3>
                <p className="text-gray-600">Yes! Our AI Pandits understand and respond in multiple Indian languages including Hindi, Tamil, Telugu, Bengali, and more. This makes our spiritual guidance accessible to everyone, regardless of language preference.</p>
              </div>
              
              <div className="bg-white p-12 rounded-t-[2rem]">
                <h3 className="text-xl font-serif mb-4">How does PanditAI compare to consulting with a traditional pandit?</h3>
                <p className="text-gray-600">PanditAI offers 24/7 availability, instant responses, and consistent guidance based on classic texts - all at a fraction of the cost of traditional consultations. While we value the wisdom of traditional pandits, our service provides convenience and accessibility that traditional methods cannot match.</p>
            </div>
            
              <div className="bg-white p-12 rounded-t-[2rem]">
                <h3 className="text-xl font-serif mb-4">Can I change or cancel my subscription plan?</h3>
                <p className="text-gray-600">Yes, you can easily upgrade, downgrade, or cancel your subscription at any time from your account settings. Changes take effect at the beginning of your next billing cycle, and we offer a 7-day money-back guarantee for all new subscriptions.</p>
            </div>
            
              <div className="bg-white p-12 rounded-t-[2rem]">
                <h3 className="text-xl font-serif mb-4">What if I need help using the platform?</h3>
                <p className="text-gray-600">Our support team is available via email and chat to assist with any questions. Plus and Premium subscribers receive priority support. We also offer detailed guides and tutorials to help you get the most from your consultations.</p>
              </div>
          </div>
        </div>
      </section>
      
        {/* Final CTA Section */}
        <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
            <h2 className="text-4xl font-serif mb-6">Start Your Spiritual Journey Today</h2>
            <p className="text-lg mb-12 max-w-2xl mx-auto text-gray-600">
              Get personalized guidance from your AI Pandit and unlock cosmic insights about your life path.
          </p>
          <Link
            href="/auth/signin"
              className="rounded-full bg-gray-900 px-12 py-4 text-lg font-serif text-white transition-all hover:bg-gray-800 inline-flex items-center gap-3"
            >
              Get Your Personalized Reading Now
              <div className="w-2 h-2 bg-white rounded-full"></div>
          </Link>
            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-12">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-4 h-4 rounded-full border-2 border-gray-900"></div>
                Free 7-day trial
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-4 h-4 rounded-full border-2 border-gray-900"></div>
                No credit card required
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-4 h-4 rounded-full border-2 border-gray-900"></div>
                Cancel anytime
              </div>
            </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white"></div>
                <h3 className="text-xl font-serif text-white">panditai</h3>
              </div>
              <p className="text-sm">
                Your personal AI Pandit, available 24/7 for spiritual guidance and astrological insights.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-serif mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-serif mb-6">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-serif mb-6">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-gray-400"></div>
                  support@panditai.in
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-gray-400"></div>
                  panditai.in
                </li>
              </ul>
              <div className="mt-8 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} PanditAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
