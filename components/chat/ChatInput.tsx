import { Agent } from "@/types/agent";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import mixpanel from "@/lib/mixpanel";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  sending: boolean;
  step: string;
  agent?: Agent | null;
  suggestedQuestions: string[];
  onSuggestedQuestionClick: (question: string) => void;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  sending,
  step,
  agent,
  suggestedQuestions,
  onSuggestedQuestionClick
}: ChatInputProps) {
  const isDisabled = sending || (step !== 'ready' && step !== 'chatting');
  
  // Check if we have valid questions to display
  const hasQuestions = suggestedQuestions && suggestedQuestions.length > 0;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[var(--bg-white)] to-transparent pt-4">
      <div className="mx-auto max-w-4xl px-4">
        {/* Input Box */}
        <div className="rounded-t-[2rem] bg-[var(--bg-white)] p-6 shadow-custom border border-gray-200">
          {/* Suggested Questions - now inside the input container */}
          {hasQuestions && (
            <div className="mb-5 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
              <div className="flex space-x-2 w-max min-w-full">
                {suggestedQuestions.map((question, index) => (
                  <button 
                    key={index}
                    onClick={() => {
                      mixpanel.track("Suggested Question Clicked", { question });
                      onSuggestedQuestionClick(question);
                    }}
                    className="flex items-center whitespace-nowrap px-4 py-2 bg-[#F5F2EE] rounded-full text-sm font-primary-regular text-[var(--text-primary)] hover:bg-gray-200 transition-colors border border-gray-100 flex-shrink-0"
                    disabled={sending}
                  >
                    {question}
                    <ChevronRight className="ml-1 h-3 w-3 text-gray-500" />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <form onSubmit={e => {
            mixpanel.track("Chat Input Submitted", { location: "Chat", message: input });
            onSubmit(e);
          }} className="flex items-center gap-3">
            <input 
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                mixpanel.track("Chat Input Typed", { location: "Chat", value: e.target.value });
              }}
              placeholder={!isDisabled 
                ? `Ask ${agent ? agent.name : 'anything'}...` 
                : "Please complete the setup process first..."}
              className="w-full rounded-full border border-gray-200 bg-[var(--bg-beige)] px-4 py-3 text-[var(--text-primary)] placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
              disabled={isDisabled}
            />
            <button 
              type="submit"
              className={cn(
                "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-colors",
                input.trim() && !isDisabled
                  ? "bg-[var(--accent-dark)] text-white hover:bg-opacity-90"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
              disabled={isDisabled || !input.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              <span className="sr-only">Send</span>
            </button>
          </form>
          <div className="mt-3 text-xs text-[var(--text-secondary)] font-primary-regular">
            {isDisabled ? (
              step === 'initial' ? "Loading options..." : 
              step === 'agent' ? "Please select a Pandit to continue" : 
              "Please select a Kundali to continue"
            ) : (
              agent ? 
              `Each AI response costs ₹3 per message. Your messages are free.` :
              "Each AI response costs ₹3 per message. Your messages are free."
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 