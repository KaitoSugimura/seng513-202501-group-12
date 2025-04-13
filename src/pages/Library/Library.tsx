import { Query } from "appwrite";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import QuizListViewer from "../../components/QuizListViewer";
import { useAuth } from "../../context/AuthContext";
import { databases, dbId, Quiz, QuizHistory } from "../../util/appwrite";
import styles from "./Library.module.css";

export default function Library() {
  const { user, loadingAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "favoritedQuizzes" | "quizHistory"
  >("favoritedQuizzes");
  const [userQuizAndQuizHistoryPairs, setUserQuizAndQuizHistoryPairs] =
    useState<{ quiz: Quiz; quizHistory: QuizHistory }[]>([]);
  const [loadingQuizHistory, setLoadingQuizHistory] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (!user || activeTab !== "quizHistory") {
      return;
    }
    const fetchUserQuizAndQuizHistoryPairs = async () => {
      setLoadingQuizHistory(true);
      try {
        const userQuizHistory = await databases.listDocuments(
          dbId,
          "quizHistory",
          [Query.contains("userId", user.$id)]
        );

        const quizHistoryQuizIds = userQuizHistory.documents.map(
          (quizHistory) => quizHistory.quizId
        );

        const correspondingQuizzes = await databases.listDocuments(
          dbId,
          "quizzes",
          [Query.contains("$id", quizHistoryQuizIds)]
        );

        const quizHistoryList = userQuizHistory.documents as QuizHistory[];
        const correspondingQuizzesList =
          correspondingQuizzes.documents as Quiz[];

        const pairs: { quiz: Quiz; quizHistory: QuizHistory }[] = [];

        quizHistoryList.forEach((quizHistory) => {
          const correspondingQuiz = correspondingQuizzesList.find(
            (quiz) => quiz.$id === quizHistory.quizId
          );
          if (correspondingQuiz) {
            pairs.push({ quiz: correspondingQuiz, quizHistory: quizHistory });
          }
        });

        setUserQuizAndQuizHistoryPairs(pairs);
      } catch (err) {
        console.error("Failed to fetch user's quiz history:", err);
      }
      setLoadingQuizHistory(false);
    };

    fetchUserQuizAndQuizHistoryPairs();
  }, [user, activeTab]);

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
          {activeTab === "favoritedQuizzes" &&
            (user.favoritedQuizIds?.length > 0 ? (
              <QuizListViewer
                key={activeTab}
                title="Favorited Quizzes"
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
            ))}
          {activeTab === "quizHistory" &&
            (loadingQuizHistory === null ||
            loadingQuizHistory === true ||
            userQuizAndQuizHistoryPairs.length > 0 ? (
              <QuizListViewer
                key={activeTab}
                title="Quiz History"
                quizAndQuizHistoryPairs={userQuizAndQuizHistoryPairs}
              />
            ) : (
              <>
                <h3 className={styles.emptyListMessage}>
                  You haven't played any quizzes yet.
                </h3>
                <NavLink to="/home">
                  <button className={styles.navigateElsewhereButton}>
                    Start Playing Quizzes Now!
                  </button>
                </NavLink>
              </>
            ))}
        </>
      )}
    </div>
  );
}
