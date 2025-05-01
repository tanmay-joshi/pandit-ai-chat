"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HomeChatInput() {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    // Redirect to new chat with question as query param
    router.push(`/chat/new?question=${encodeURIComponent(input.trim())}`);
  };

  return (
    <div className="my-8">
      <div className="neu-card rounded-t-[2rem] p-6 shadow-custom border border-gray-200 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="w-full rounded-full border border-gray-200 bg-[var(--bg-beige)] px-4 py-3 text-[var(--text-primary)] placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
            disabled={sending}
          />
          <button
            type="submit"
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-colors ${input.trim() && !sending ? "bg-[var(--accent-dark)] text-white hover:bg-opacity-90" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            disabled={sending || !input.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            <span className="sr-only">Send</span>
          </button>
        </form>
        <div className="mt-3 text-xs text-[var(--text-secondary)] font-primary-regular">
          Each AI response costs ₹3 per message. Your messages are free.
        </div>
      </div>
    </div>
  );
} 