import { useState } from "react";
import type { Quiz as QuizType } from "../types";
import "./Quiz.css";

interface QuizProps {
  questions: QuizType;
  lessonTitle: string;
}

function Quiz({ questions, lessonTitle }: QuizProps): JSX.Element {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const handleAnswerSelect = (answerIndex: number): void => {
    if (!showAnswer) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleShowAnswer = (): void => {
    if (selectedAnswer !== null) {
      setShowAnswer(true);
      if (selectedAnswer === questions[currentQuestion].correct) {
        setScore(score + 1);
      }
    }
  };

  const handleNextQuestion = (): void => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = (): void => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const percentage: number = (score / questions.length) * 100;
    const percentageStr: string = percentage.toFixed(0);
    return (
      <div className="quiz-container">
        <div className="quiz-completed">
          <h2>🎉 סיימת את המבחן!</h2>
          <div className="quiz-score">
            <div className="score-circle">
              <span className="score-number">{percentageStr}%</span>
              <span className="score-text">
                {score} מתוך {questions.length}
              </span>
            </div>
          </div>
          <div className="score-message">
            {percentage >= 80 && (
              <p className="excellent">מצוין! הבנת את החומר היטב! 🌟</p>
            )}
            {percentage >= 60 && percentage < 80 && (
              <p className="good">יפה! יש הבנה טובה 👍</p>
            )}
            {percentage < 60 && (
              <p className="needs-improvement">כדאי לחזור על החומר 📚</p>
            )}
          </div>
          <button className="quiz-restart-btn" onClick={handleRestart}>
            התחל מחדש
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2 className="quiz-title">{lessonTitle} - מבחן</h2>
        <div className="quiz-progress">
          שאלה {currentQuestion + 1} מתוך {questions.length}
        </div>
      </div>

      <div className="quiz-body">
        <div className="question-text">{question.question}</div>

        <div className="answers-grid">
          {question.answers.map((answer, index) => {
            const isCorrect = index === question.correct;
            const isSelected = index === selectedAnswer;

            let className = "answer-option";
            if (showAnswer) {
              if (isCorrect) {
                className += " correct";
              } else if (isSelected && !isCorrect) {
                className += " incorrect";
              }
            } else if (isSelected) {
              className += " selected";
            }

            return (
              <div
                key={index}
                className={className}
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="answer-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="answer-text">{answer}</span>
                {showAnswer && isCorrect && (
                  <span className="check-mark">✓</span>
                )}
                {showAnswer && isSelected && !isCorrect && (
                  <span className="x-mark">✗</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="quiz-actions">
          {!showAnswer && (
            <button
              className="quiz-btn show-answer-btn"
              onClick={handleShowAnswer}
              disabled={selectedAnswer === null}
            >
              הצג תשובה נכונה
            </button>
          )}
          {showAnswer && (
            <button
              className="quiz-btn next-question-btn"
              onClick={handleNextQuestion}
            >
              {currentQuestion < questions.length - 1
                ? "שאלה הבאה →"
                : "סיים מבחן"}
            </button>
          )}
        </div>

        {showAnswer && (
          <div className="explanation">
            <strong>הסבר:</strong> {question.explanation}
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
