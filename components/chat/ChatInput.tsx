import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Agent } from "../../types/chat";
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
          <form onSubmit={onSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={!isDisabled 
                ? `Ask ${agent ? agent.name : 'anything'}...` 
                : "Please complete the setup process first..."}
              className="min-h-[44px] flex-1 resize-none rounded-xl border-0 bg-gray-100 px-4 py-3 focus:ring-0"
              disabled={isDisabled}
            />
            <Button
              type="submit"
              size="icon"
              className="h-[44px] w-[44px] rounded-xl bg-black hover:bg-black/90"
              disabled={isDisabled || !input.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <div className="mt-2 text-xs text-gray-500">
            {isDisabled ? (
              step === 'initial' ? "Loading options..." : 
              step === 'agent' ? "Please select a Pandit to continue" : 
              "Please select a Kundali to continue"
            ) : (
              agent ? 
              `Each AI response costs ${agent.messageCost} credits. Your messages are free.` :
              "Each AI response costs 10 credits. Your messages are free."
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 