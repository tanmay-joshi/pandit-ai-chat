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
    <div className="p-4 border-b border-gray-100">
      <div className="mb-2">
        <p className="text-sm text-gray-600">
          {isLoading ? "Loading suggestions..." : "Try asking:"}
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
            className="px-4 py-2 bg-[#F5F2EE] rounded-full text-sm hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
} 