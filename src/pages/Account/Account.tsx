import AuthCard from "../../components/Auth/AuthCard";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import styles from "./Account.module.css";
import { useState } from "react";
import quizData from "../../database/stubQuiz";
import QuizCard from "../../components/QuizCard";

export default function Account() {
  const { user, loadingAuth, logout } = useAuth();
  const [filteredData, setFilteredData] = useState(quizData);

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
          <h2>Welcome back, {user.username}!</h2>
          
          {/* Points progress */}
          <h2>Experience</h2>
          <div className={styles.progressContainer}>
            <p>49/100 Points to Level Up</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '49%' }}></div>
            </div>
          </div>
          
          {/* Created quizzes section */}
          <h2>Created Quizzes</h2>
          <div className={styles.quizGrid}>
            {filteredData.map((quiz) => (
              <QuizCard key={`${quiz.$id}`} quiz={quiz} />
            ))}
          </div>
          
          {/* Welcome message and logout button */}
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
