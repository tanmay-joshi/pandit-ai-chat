import { Agent } from "@/types/agent";
import SuggestedQuestions from "@/components/SuggestedQuestions";

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
  
  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-4xl">
        <SuggestedQuestions 
          questions={suggestedQuestions} 
          onQuestionClick={onSuggestedQuestionClick}
          isLoading={sending} 
        />
        <div className="p-4">
          <form onSubmit={onSubmit} className="flex items-center gap-4">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={!isDisabled 
                ? `Ask ${agent ? agent.name : 'anything'}...` 
                : "Please complete the setup process first..."}
              className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              disabled={isDisabled}
            />
            <button 
              type="submit"
              className="bg-gray-900 text-white rounded-full p-3 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDisabled || !input.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              <span className="sr-only">Send</span>
            </button>
          </form>
          <div className="mt-2 text-xs text-gray-500">
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