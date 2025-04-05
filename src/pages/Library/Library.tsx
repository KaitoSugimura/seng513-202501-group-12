import { useEffect, useState } from "react";
import QuizCard from "../../components/QuizCard";
import { useAuth } from "../../context/AuthContext";
import { databases, dbId, Quiz } from "../../util/appwrite";
import styles from "./Library.module.css";

export default function Library() {
  const { user, loadingAuth } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchQuizzes = async () => {
      const quizzes = (await databases.listDocuments(dbId, "quizzes"))
        .documents as Quiz[];

      setQuizzes(quizzes);
    };

    fetchQuizzes();
  }, [user]);

  if (loadingAuth) {
    return (
      <div className={styles.libraryRoot}>
        <h1 className={styles.title}>Library</h1>

        <p className={styles.subtitle}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.libraryRoot}>
      <h1 className={styles.title}>Library</h1>

      <div className={styles.quizGrid}>
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.$id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
}
