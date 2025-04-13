import React from "react";

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  isLoading?: boolean;
}

export default function SuggestedQuestions({
  questions,
  onQuestionClick,
  isLoading = false
}: SuggestedQuestionsProps) {
  // Add debug logging
  console.log("Rendering SuggestedQuestions with:", { questions, isLoading });

  if (!questions || questions.length === 0) {
    console.log("No questions to display");
    return null;
  }

  return (
    <div className="p-3 mb-2 neu-inset rounded-xl">
      <div className="flex items-center mb-2">
        <p className="text-xs text-neutral-600 font-medium">
          {isLoading ? "Loading suggestions..." : "Suggested questions:"}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => {
              console.log("Question clicked:", question);
              onQuestionClick(question);
            }}
            className="text-xs neu-button neu-button-hover px-3 py-1.5 rounded-full transition-colors"
            disabled={isLoading}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
} 