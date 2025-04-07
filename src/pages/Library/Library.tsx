import { useEffect, useState } from "react";
import QuizCard from "../../components/QuizCard";
import { useAuth } from "../../context/AuthContext";
import { databases, dbId, Quiz } from "../../util/appwrite";
import styles from "./Library.module.css";
import { NavLink } from "react-router-dom";

export default function Library() {
  const { user, loadingAuth } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeTab, setActiveTab] = useState<
    "favoritedQuizzes" | "quizHistory"
  >("favoritedQuizzes");

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchFavoriteQuizzes = async () => {
      const quizzes = (await databases.listDocuments(dbId, "quizzes"))
        .documents as Quiz[];

      setQuizzes(quizzes);
    };

    fetchFavoriteQuizzes();
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

      {!user && (
        <>
          <h3>Sign in to access library features.</h3>

          <NavLink to="/account">
            <button>Sign In</button>
          </NavLink>
        </>
      )}
      {user && (
        <>
          <div className={styles.libraryTabLayout}>
            <button
              className={`${styles.tab} ${
                activeTab === "favoritedQuizzes" ? styles.selected : ""
              }`}
              onClick={() => setActiveTab("favoritedQuizzes")}
            >
              Favorited Quizzes
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "quizHistory" ? styles.selected : ""
              }`}
              onClick={() => setActiveTab("quizHistory")}
            >
              Quiz History
            </button>
          </div>
          <div className={styles.quizGrid}>
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.$id} quiz={quiz} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
