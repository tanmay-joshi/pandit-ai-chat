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
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="p-3 mb-2 border-t border-gray-200 neu-inset">
      <div className="flex items-center mb-2">
        <p className="text-xs neu-text font-medium">
          {isLoading ? "Loading suggestions..." : "Suggested questions:"}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
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