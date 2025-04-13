import React, { useEffect } from "react";
import { logger } from "../lib/logger";

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
  // Log on component mount and when questions change
  useEffect(() => {
    logger.debug("SuggestedQuestions mounted/updated with questions:", questions);
    
    // Log questions as a stringified array to see exact content
    if (questions && questions.length > 0) {
      logger.debug("Questions stringified:", JSON.stringify(questions));
    }
  }, [questions]);

  // Check if we have valid questions to display
  if (!questions || questions.length === 0) {
    logger.debug("No questions to display, returning null");
    return null;
  }

  logger.info("Rendering SuggestedQuestions with", questions.length, "questions");

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
              logger.info("Question clicked:", question);
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