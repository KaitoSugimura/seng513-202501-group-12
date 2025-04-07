import { useState } from "react";
import QuizListViewer from "../../components/QuizListViewer";
import { Query } from "appwrite";
import { useAuth } from "../../context/AuthContext";
import styles from "./Library.module.css";
import { NavLink } from "react-router-dom";

export default function Library() {
  const { user, loadingAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "favoritedQuizzes" | "quizHistory"
  >("favoritedQuizzes");

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
      <h1 className={styles.title}>
        {user ? `${user.username}'s Quiz Library` : "Quiz Library"}
      </h1>

      {!user && (
        <>
          <h3>Sign in to access the Quiz Library feature.</h3>

          <NavLink to="/account">
            <button>Sign In Here!</button>
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
          <QuizListViewer
            key={activeTab}
            title={
              activeTab === "favoritedQuizzes"
                ? "Favorited Quizzes"
                : "Quiz History"
            }
            query={[Query.contains("$id", user.favoritedQuizIds)]}
            limitLessView={true}
          />
        </>
      )}
    </div>
  );
}
