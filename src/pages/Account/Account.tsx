import AuthCard from "../../components/Auth/AuthCard";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import styles from "./Account.module.css";
import { useState, useEffect } from "react";
import quizData from "../../database/stubQuiz";
import QuizCard from "../../components/QuizCard";

export default function Account() {
  const { user, loadingAuth, logout } = useAuth();
  const [filteredData, setFilteredData] = useState(quizData);

  useEffect(() => {
    if (user) {
      setFilteredData(
        quizData.filter((quiz) => quiz.creatorUsername.includes(user.username))
      );
    }
  }, [user]);

  if (loadingAuth) {
    return (
      <div className={styles.accountRoot}>
        <h1 className={styles.title}>Account</h1>
        <p className={styles.subtitle}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.accountRoot}>
      <h1 className={styles.header}>Account</h1>

      {user && (
        <>
          <h2 className={styles.headerSub}>Welcome back, {user.username}!</h2>

          {/* Points progress */}
          <div className={styles.experienceContainer}>
            <h2>Experience</h2>
            <div className={styles.progressContainer}>
              <p> {user.points}/100 Points</p>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${user.points}%` }}></div>
              </div>
            </div>
          </div>
          

          <h2>Created Quizzes</h2>
          <div className={styles.quizGrid}>
            {filteredData.length === 0 ? (
              <div className={styles.noQuizzes}>
                Try making your first quiz!
              </div>
            ) : (
              filteredData.map((quiz) => (
                <QuizCard key={`${quiz.$id}`} quiz={quiz} />
              ))
            )}
          </div>

          
          <div className={styles.userControls}>
            <Button className={styles.logoutButton} onClick={logout}>
              Sign Out
            </Button>
          </div>
        </>
      )}
      {!user && (
        <>
          <p className={styles.subtitle}>Sign in to access all features.</p>
          <AuthCard />
        </>
      )}
    </div>
  );
}
