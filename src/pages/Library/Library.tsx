import { Query } from "appwrite";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import QuizListViewer from "../../components/QuizListViewer";
import { useAuth } from "../../context/AuthContext";
import styles from "./Library.module.css";

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
          <h3 className={styles.unregisteredUserMessage}>
            The Quiz Library feature is only available for registered users.
          </h3>

          <NavLink to="/account">
            <button className={styles.navigateElsewhereButton}>
              Sign In Now To Access Your Quiz Library!
            </button>
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
          {user.favoritedQuizIds?.length > 0 ? (
            <QuizListViewer
              key={activeTab}
              title={
                activeTab === "favoritedQuizzes"
                  ? "Favorited Quizzes"
                  : "Quiz History"
              }
              query={[Query.contains("$id", user.favoritedQuizIds)]}
            />
          ) : (
            <>
              <h3 className={styles.emptyListMessage}>
                You have no favorited quizzes.
              </h3>
              <NavLink to="/home">
                <button className={styles.navigateElsewhereButton}>
                  Start Favoriting Quizzes Now!
                </button>
              </NavLink>
            </>
          )}
        </>
      )}
    </div>
  );
}
