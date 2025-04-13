import { ID, Query } from "appwrite";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { databases, dbId, Question, Quiz, User } from "../../util/appwrite";
import Timer from "../Timer/Timer";
import styles from "./QuizPage.module.css";

export default function QuizPage() {
  const quizId = window.location.pathname.split("/")[2];
  const [thisQuiz, setThisQuiz] = useState<Quiz | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizResults, setQuizResults] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuizScore, setCurrentQuizScore] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const { user, setUser } = useAuth();

  useEffect(() => {
    const updateUserDataWithCompletedQuiz = async () => {
      if (user) {
        try {
          const updatedScore = user.points + currentQuizScore;
          const updatedUser = await databases.updateDocument(
            dbId,
            "users",
            user.$id,
            {
              points: updatedScore,
            }
          );
          setUser(updatedUser as User);
        } catch (err) {
          console.error("Failed to update user score:", err);
        }

        try {
          await databases.createDocument(dbId, "quizHistory", ID.unique(), {
            quizId: thisQuiz?.$id,
            userId: user.$id,
            date: new Date(),
            score: currentQuizScore,
          });
        } catch (err) {
          console.error("Failed to create Quiz History object:", err);
        }
      }
    };
    updateUserDataWithCompletedQuiz();
  }, [showEndScreen]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quiz = await databases.getDocument(dbId, "quizzes", quizId);
        setThisQuiz(quiz as Quiz);
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questions = (
          await databases.listDocuments(dbId, "questions", [
            Query.equal("quizId", quizId),
          ])
        ).documents as Question[];

        setQuizQuestions(questions);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };
    fetchQuestions();
    setStartTime(Date.now());
  }, [thisQuiz]);

  const handleOptionSelect = (index: number) => {
    if (index === quizQuestions[currentQuestionIndex].answerIndex) {
      const score = Math.round(10 - (Date.now() - startTime) / 1000);
      quizResults.push(score);
      setCurrentQuizScore(currentQuizScore + score);
    } else {
      quizResults.push(0);
    }

    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setStartTime(Date.now());
    } else {
      setShowEndScreen(true);
    }
  };

  const checkAnswer = (index: number) => {
    if (index > currentQuestionIndex) {
      return "unanswered";
    } else if (index === currentQuestionIndex) {
      return "current";
    } else {
      if (quizResults[index] > 0) {
        return "correct";
      } else {
        return "wrong";
      }
    }
  };

  if (!thisQuiz || !quizQuestions) {
    return (
      <div className={styles.quizRoot}>
        <div className={styles.loading}>
          <LoadingSpinner />
          <h1>Loading quiz...</h1>
        </div>
      </div>
    );
  }

  if (showEndScreen) {
    return (
      <div className={styles.quizRoot}>
        <div className={styles.endFormat}>
          <div className={styles.endHeading}>
            <img
              src={thisQuiz.previewUrl}
              alt={`Image for ${thisQuiz.title}`}
              className={styles.endImage}
            />
            <h1>{thisQuiz.title} Quiz Results</h1>
          </div>

          <h2>Your overall score for this quiz is: {currentQuizScore}</h2>
          <div className={styles.resultHeading}>
            <h3>Question</h3>
            <h3>Score</h3>
          </div>
          <div className={styles.resultSection}>
            {quizQuestions.map((q, index) => (
              <div className={styles.endQuestionTab} key={index}>
                <h3>Question {index + 1}</h3>
                <h3 className={styles.endScore}>{quizResults[index]}</h3>
              </div>
            ))}
          </div>

          <div className={styles.exitSection}>
            <Link key={thisQuiz.id} to={`/home`}>
              <button className={styles.exitButton}>Exit Quiz</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quizRoot}>
      <div className={styles.quizContent}>
        <div className={styles.quizLeft}>
          <div className={styles.quizDetails}>
            <h2 className={styles.title}>Quiz Name: {thisQuiz.title}</h2>
            <div className={styles.quizInfo}>
              <h4 className={styles.title}>
                Quiz Type:{" "}
                {thisQuiz.type.charAt(0).toUpperCase() +
                  thisQuiz.type.slice(1).toLowerCase()}
              </h4>
              <h4 className={styles.title}>Quiz Theme: {thisQuiz.theme}</h4>
            </div>
            <h3>Current Score: {currentQuizScore}</h3>
            <div className={styles.questionsLayout}>
              {quizQuestions.map((q, index) => (
                <div key={index}>
                  <h4
                    className={
                      checkAnswer(index) === "current"
                        ? styles.questionTab
                        : styles.inactiveQuestionTab
                    }
                  >
                    Question {index + 1}
                    {checkAnswer(index) === "correct" ? (
                      <span>✅</span>
                    ) : checkAnswer(index) == "wrong" ? (
                      <span>❌</span>
                    ) : null}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.questionFormat}>
          <div className={styles.timer}>
            <Timer
              startTime={Date.now()}
              roundTime={10}
              gameStarted={true}
              onEndOfTime={() => handleOptionSelect(-1)}
              currentRound={currentQuestionIndex + 1}
              totalRounds={quizQuestions.length}
            />
          </div>

          <div
            key={currentQuestionIndex}
            className={
              thisQuiz.type === "blur"
                ? styles.questionBlurImage
                : styles.questionZoomImage
            }
          >
            <img
              src={quizQuestions[currentQuestionIndex]?.imageUrl}
              alt={`Image for ${thisQuiz.title}`}
              className={
                thisQuiz.type === "blur"
                  ? styles.quizBlurImage
                  : styles.quizZoomImage
              }
            />
          </div>

          <div className={styles.optionsLayout}>
            {quizQuestions[currentQuestionIndex]?.options.map((opt, index) => (
              <div key={index}>
                <button
                  className={styles.option}
                  onClick={() => {
                    handleOptionSelect(index);
                  }}
                >
                  {opt}
                </button>
              </div>
            ))}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
