import { useEffect, useState } from "react";
import { databases, dbId, Quiz, Question } from "../../util/appwrite";
import styles from "./QuizPage.module.css";
import { Query } from "appwrite";

export default function QuizPage() {
  const [thisQuiz, setThisQuiz] = useState<Quiz | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[] | null>(null);
  const quizId = window.location.pathname.split("/")[2];

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
        console.error("Failed to fetch quiz:", err);
      }
    };
    fetchQuestions();
  }, [quizId]);

  if (!thisQuiz) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className={styles.heading}>
      <h1>Now Playing: {thisQuiz.title}</h1>
      <img
        src={thisQuiz.previewUrl}
        alt={`Image for ${thisQuiz.title}`}
        className={styles.quizImage}
      />
      <h1>Questions Number: {quizQuestions?.length}</h1>
      {/* Add more quiz content here */}
    </div>
  );
}
